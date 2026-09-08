import * as fs from "node:fs";
import * as path from "node:path";
import pc from "picocolors";
import { detectFramework, type PlatformKind } from "../lib/detect-framework.js";
import { detectTailwind, type TailwindVersion } from "../lib/detect-tailwind.js";
import { isErrnoException } from "../lib/fs-errors.js";
import { emitTailwindV3Config } from "../lib/emit-tailwind-config.js";
import {
	emitNativeTailwindConfig,
	entryImportsGlobalsCss,
	nativePeerDeps,
	nativeTemplateFiles,
	writeNativeTemplate,
	type TemplateWrite,
} from "../lib/native-template.js";
import { writeMcpEntry } from "../lib/mcp-config.js";
import { printSkillsHint } from "../lib/post-install.js";
import { detectSrcLayout } from "../lib/resolve-alias.js";
import { runInstall } from "../lib/run-install.js";
import { runDoctor } from "./doctor.js";

/** URL of the live Hex Core token-tweaking studio. Surfaced in hex.config.json + post-init output so agents discover it. */
const STUDIO_URL = "https://hex-core.dev/studio";

/** Per-target overwrite set. `--overwrite` (no value) → "all". */
export type OverwriteTargets = Set<
	"globals.css" | "tailwind.config.ts" | "global.css" | "tailwind.config.js" | "all"
>;

export interface InitOptions {
	theme: string;
	/**
	 * Either a boolean (legacy: `true` = replace everything, `false` = skip)
	 * or a typed `Set` of specific files to replace. Boolean form keeps
	 * older programmatic callers and tests working.
	 */
	overwrite?: boolean | OverwriteTargets;
	install?: boolean;
	/** When true, skip writes and exit non-zero if alias drift is detected. CI use. */
	check?: boolean;
	/**
	 * When true, write the @hex-core/mcp server entry into the consumer's
	 * MCP config (creates `.mcp.json` at repo root if no file exists yet;
	 * otherwise merges into `.cursor/mcp.json` / `.continue/config.json`).
	 *
	 * Defaults to false: `.mcp.json` is commit-tracked and auto-loaded by
	 * Claude Code, so `hex init` requires explicit opt-in (`--mcp`) before
	 * adding a server entry. Sensitive-surface writes don't happen by
	 * accident.
	 */
	mcp?: boolean;
	/**
	 * Which render target to scaffold. Omitted means "ask the project":
	 * an Expo or React Native app gets the native template, everything else
	 * the web one.
	 */
	platform?: PlatformKind;
}

/** What the summary prints for each {@link ConfigWrite} outcome. */
const CONFIG_WRITE_MESSAGE: Record<ConfigWrite, string> = {
	created: "Created hex.config.json",
	updated: "Updated hex.config.json (recorded platform)",
	unchanged: "hex.config.json already existed — left in place.",
};

/** URL of the @hex-core/mcp manual-install docs. Surfaced when --mcp is off. */
const MCP_DOCS_URL = "https://hex-core.dev/mcp";

function shouldOverwrite(
	value: boolean | OverwriteTargets | undefined,
	target: "globals.css" | "tailwind.config.ts",
): boolean {
	if (!value) return false;
	if (value === true) return true;
	return value.has("all") || value.has(target);
}

/**
 * Parse a comma-separated `--overwrite` value into the typed target set.
 * Bare `--overwrite` (no value) becomes `{"all"}` for backwards compat
 * with `@hex-core/cli@0.4.x`.
 */
export function parseOverwriteFlag(raw: string | boolean | undefined): OverwriteTargets | undefined {
	if (raw === undefined || raw === false) return undefined;
	if (raw === true || raw === "") return new Set(["all"]);
	const set: OverwriteTargets = new Set();
	// The native template writes different filenames from the web one
	// (`global.css`, `tailwind.config.js`), so both spellings are accepted —
	// otherwise no targeted value could ever name a native file.
	const known = ["all", "globals.css", "tailwind.config.ts", "global.css", "tailwind.config.js"] as const;
	for (const part of String(raw).split(",")) {
		const trimmed = part.trim();
		const match = known.find((target) => target === trimmed);
		if (match) {
			set.add(match);
		} else {
			console.error(`Unknown --overwrite target: "${trimmed}". Use one of: ${known.join(", ")}.`);
			process.exit(1);
		}
	}
	return set;
}

/**
 * Initialize a new Hex Core project.
 *
 * Writes `hex.config.json` plus a `globals.css` shaped to the consumer's
 * detected Tailwind version, and (for v3) a `tailwind.config.ts`. Prints
 * the exact peer-dep install line the user still needs to run.
 *
 * `--check` mode runs the doctor and exits non-zero on drift without
 * touching any files. Designed for CI / pre-commit hooks.
 *
 * @param options.theme - The theme preset to scaffold from.
 * @param options.overwrite - Set of targets to replace; undefined means skip-if-exists.
 * @param options.check - When true, only verify state; never write.
 */
export async function initProject(options: InitOptions) {
	const cwd = process.cwd();
	const configPath = path.join(cwd, "hex.config.json");
	const detection = detectFramework(cwd);
	const platform = options.platform ?? detection.platform;
	const tailwind = detectTailwind(cwd);

	if (options.check) {
		const checks = await runDoctor(cwd);
		const failed = checks.filter((c) => c.status === "fail").length;
		const warned = checks.filter((c) => c.status === "warn").length;
		console.log(`hex init --check: ${failed} fail, ${warned} warn.`);
		for (const c of checks) {
			if (c.status === "fail" || c.status === "warn") {
				console.log(`  [${c.status}] ${c.name}${c.hint ? ` — ${c.hint}` : ""}`);
			}
		}
		process.exit(failed > 0 ? 1 : 0);
	}

	if (platform === "native") {
		await initNativeProject(cwd, options, detection);
		return;
	}

	if (tailwind.version === "missing") {
		console.error("tailwindcss is not installed in this project.");
		console.error("Install Tailwind first, then re-run hex init:");
		console.error("  pnpm add -D tailwindcss@^4 @tailwindcss/postcss   # for Tailwind v4 (recommended)");
		console.error("  pnpm add -D tailwindcss@^3 postcss autoprefixer  # for Tailwind v3");
		process.exit(1);
	}

	const srcLayout = detectSrcLayout(cwd);
	const wroteConfig = writeHexConfig(configPath, options.theme);
	const cssTarget = pickGlobalsTarget(cwd);
	const wroteCss = await writeGlobalsCss(cssTarget, options.theme, tailwind.version, shouldOverwrite(options.overwrite, "globals.css"));
	const wroteTwConfig =
		tailwind.version === "v3"
			? await writeTailwindConfig(path.join(cwd, "tailwind.config.ts"), options.theme, shouldOverwrite(options.overwrite, "tailwind.config.ts"))
			: { wrote: false, skipped: false };

	const peerDeps = peerDepsFor(tailwind.version);
	const installResult = await maybeInstall(cwd, peerDeps, options.install ?? true);

	printSummary({
		wroteConfig,
		wroteCss,
		wroteTwConfig,
		tailwindVersion: tailwind.version,
		tailwindRange: tailwind.rawRange,
		cssTarget: path.relative(cwd, cssTarget),
		peerDeps,
		installed: installResult,
		srcLayout,
		mcp: options.mcp,
	});
}

/**
 * What `writeHexConfig` did, so the summary can say it accurately.
 *
 * A boolean could not: merging `platform` into an existing config rewrote
 * the file and reported `true`, which printed "Created hex.config.json" over
 * a file that already existed.
 */
type ConfigWrite = "created" | "updated" | "unchanged";

/**
 * Add `platform` to an existing `hex.config.json` when it is missing or wrong.
 *
 * Deliberately narrow: it touches that one field and leaves every other
 * setting the user has (aliases, theme) exactly as it was.
 * @param configPath - Absolute path to `hex.config.json`
 * @param platform - The platform this init resolved to
 * @returns Whether the file was rewritten
 */
function mergePlatformIntoConfig(configPath: string, platform: PlatformKind): ConfigWrite {
	try {
		const raw: unknown = JSON.parse(fs.readFileSync(configPath, "utf-8"));
		if (typeof raw !== "object" || raw === null) return "unchanged";
		const config: Record<string, unknown> = { ...raw };
		if (config.platform === platform) return "unchanged";
		config.platform = platform;
		if (platform === "native") config.styling = "nativewind";
		fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
		return "updated";
	} catch {
		// A malformed config is the user's to fix; never overwrite it.
		return "unchanged";
	}
}

/**
 * Whether one native template file may be replaced.
 *
 * Mirrors {@link shouldOverwrite} on the web path, but matches on the file's
 * own basename so `--overwrite global.css` names something real.
 * @param value - The parsed `--overwrite` flag
 * @param filePath - Cwd-relative path of the file about to be written
 * @returns True when the file may be replaced
 */
function shouldOverwriteNative(
	value: boolean | OverwriteTargets | undefined,
	filePath: string,
): boolean {
	if (!value) return false;
	if (value === true) return true;
	if (value.has("all")) return true;
	const base = path.basename(filePath);
	for (const target of value) {
		if (target === base) return true;
	}
	return false;
}

/**
 * Scaffold a React Native project: the NativeWind config chain plus the
 * token stylesheet, written from the same `@hex-core/tokens` functions the
 * web path uses.
 *
 * Deliberately does not edit the app's entry file. Rewriting someone's root
 * layout is the kind of silent change that breaks a working app, so the
 * summary prints the one import line to add instead.
 * @param cwd - Project root
 * @param options - The init options, for theme / overwrite / install
 * @param detection - Detected framework, for the entry hint and layout
 */
async function initNativeProject(
	cwd: string,
	options: InitOptions,
	detection: ReturnType<typeof detectFramework>,
): Promise<void> {
	const tokens = await import("@hex-core/tokens");
	const themeData = tokens.getTheme(options.theme);
	if (!themeData) {
		console.error(`Unknown theme "${options.theme}". Try one of: default, midnight, ember.`);
		process.exit(1);
	}

	const files = nativeTemplateFiles(
		`${tokens.generateGlobalsCssNative(themeData)}\n`,
		emitNativeTailwindConfig(tokens.themeToTailwindConfig(themeData)),
		detection,
	);
	// Per-file, matching the web path: `--overwrite global.css` must replace
	// that one file rather than silently doing nothing and then telling the
	// user to pass the flag they just passed.
	const writes = writeNativeTemplate(cwd, files, (filePath) =>
		shouldOverwriteNative(options.overwrite, filePath),
	);

	const wroteConfig = writeHexConfig(path.join(cwd, "hex.config.json"), options.theme, "native");
	const peerDeps = nativePeerDeps(detection.kind === "react-native");
	const installed = await maybeInstall(cwd, peerDeps, options.install ?? true);

	printNativeSummary({
		detection,
		writes,
		wroteConfig,
		installed,
		peerDeps,
		entryHasImport: entryImportsGlobalsCss(cwd, detection.entryHint),
	});
}

interface NativeSummaryParams {
	detection: ReturnType<typeof detectFramework>;
	writes: TemplateWrite[];
	wroteConfig: ConfigWrite;
	installed: MaybeInstallResult;
	peerDeps: string[];
	entryHasImport: boolean;
}

/**
 * Report what the native scaffold wrote and what the user still has to do.
 * @param p - {@link NativeSummaryParams}
 */
function printNativeSummary(p: NativeSummaryParams): void {
	console.log(`Detected ${p.detection.label}.`);
	console.log(CONFIG_WRITE_MESSAGE[p.wroteConfig]);
	for (const write of p.writes) {
		console.log(write.skipped ? `Skipped ${write.path} (already exists; pass --overwrite to replace).` : `Wrote ${write.path}`);
	}

	if (p.installed.manager === "(skipped)") {
		console.log(`\nSkipping auto-install (--no-install). Run yourself:`);
		console.log(`  npx expo install ${p.peerDeps.join(" ")}`);
	} else if (p.installed.exitCode !== undefined && p.installed.exitCode !== 0) {
		console.log(`\nPeer-dep install via ${p.installed.manager} exited with code ${p.installed.exitCode}.`);
		console.log(`  Prefer \`npx expo install\` on an Expo project — it picks versions your SDK supports.`);
	}

	console.log("");
	if (!p.entryHasImport) {
		console.log(pc.bold("One manual step:"));
		console.log(`  Add \`import "./global.css";\` to ${p.detection.entryHint}`);
	}
	console.log(`  Mount <PortalHost /> from @rn-primitives/portal in ${p.detection.entryHint} before adding overlay components.`);
	console.log("\nNext: hex add button text card");
	console.log(pc.dim("On a native project `hex add button` installs the native-button item."));
	printSkillsHint(process.cwd());
}

function peerDepsFor(version: TailwindVersion): string[] {
	if (version === "v4") return ["clsx", "tailwind-merge", "class-variance-authority", "tw-animate-css"];
	return ["clsx", "tailwind-merge", "class-variance-authority", "tailwindcss-animate"];
}

interface MaybeInstallResult {
	ran: boolean;
	skipped: string[];
	installed: string[];
	exitCode?: number;
	manager: string;
}

async function maybeInstall(cwd: string, peerDeps: string[], install: boolean): Promise<MaybeInstallResult> {
	if (!install) return { ran: false, skipped: peerDeps, installed: [], manager: "(skipped)" };
	const result = await runInstall(peerDeps, { cwd });
	return {
		ran: result.installed.length > 0,
		skipped: result.skipped,
		installed: result.installed,
		exitCode: result.exitCode,
		manager: result.manager,
	};
}

function writeHexConfig(configPath: string, theme: string, platform: PlatformKind = "web"): ConfigWrite {
	const config = {
		$schema: "https://hex-core.dev/schema/config.json",
		// React Native is still React — `platform` is the axis that changes.
		framework: "react",
		platform,
		styling: platform === "native" ? "nativewind" : "tailwind",
		typescript: true,
		theme,
		aliases: {
			components: "@/components",
			lib: "@/lib",
		},
		// Surfaces the live token-tweaking studio in the file an agent
		// reads first. Pairs with the post-init `Theme tweaking:` line.
		studio: STUDIO_URL,
	};

	// Exclusive create rather than "check, then write": `wx` fails with
	// EEXIST if the file appears between the two, so a config written by a
	// concurrent run is never silently overwritten.
	let handle: number;
	try {
		handle = fs.openSync(configPath, "wx");
	} catch (error) {
		if (isErrnoException(error) && error.code === "EEXIST") {
			// An existing config used to mean "leave it alone entirely", which
			// silently dropped `platform` on a re-run. Every later `hex add`
			// then fell back to detection — fine for Expo, wrong for a bare
			// React Native app in a monorepo where `react-native` is hoisted
			// rather than declared. Merge the field in instead.
			return mergePlatformIntoConfig(configPath, platform);
		}
		throw error;
	}
	try {
		fs.writeFileSync(handle, JSON.stringify(config, null, 2));
	} finally {
		fs.closeSync(handle);
	}
	return "created";
}

/**
 * Pick where to write `globals.css` based on which app dir the consumer's
 * Next.js scaffold uses. Falls back to `app/globals.css` if neither exists yet.
 */
function pickGlobalsTarget(cwd: string): string {
	const candidates = [
		path.join(cwd, "src/app/globals.css"),
		path.join(cwd, "app/globals.css"),
		path.join(cwd, "src/app"),
		path.join(cwd, "app"),
	];
	for (const c of candidates) {
		if (fs.existsSync(c)) {
			return c.endsWith("globals.css") ? c : path.join(c, "globals.css");
		}
	}
	return path.join(cwd, "app/globals.css");
}

interface WriteResult {
	wrote: boolean;
	skipped: boolean;
}

async function writeGlobalsCss(
	target: string,
	theme: string,
	tailwindVersion: TailwindVersion,
	overwrite: boolean,
): Promise<WriteResult> {
	if (fs.existsSync(target) && !overwrite) {
		return { wrote: false, skipped: true };
	}
	const tokens = await import("@hex-core/tokens");
	const themeData = tokens.getTheme(theme as "default" | "midnight" | "ember");
	if (!themeData) {
		console.error(`Unknown theme "${theme}". Try one of: default, midnight, ember.`);
		process.exit(1);
	}
	const css = tokens.generateGlobalsCss(themeData, {
		target: tailwindVersion === "v4" ? "v4" : "v3",
	});
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, css, "utf8");
	return { wrote: true, skipped: false };
}

async function writeTailwindConfig(target: string, theme: string, overwrite: boolean): Promise<WriteResult> {
	if (fs.existsSync(target) && !overwrite) {
		return { wrote: false, skipped: true };
	}
	const tokens = await import("@hex-core/tokens");
	const themeData = tokens.getTheme(theme as "default" | "midnight" | "ember");
	if (!themeData) return { wrote: false, skipped: false };
	const extendMaps = tokens.themeToTailwindConfig(themeData);
	fs.writeFileSync(target, emitTailwindV3Config(extendMaps), "utf8");
	return { wrote: true, skipped: false };
}

interface SummaryParams {
	wroteConfig: ConfigWrite;
	wroteCss: WriteResult;
	wroteTwConfig: WriteResult;
	tailwindVersion: TailwindVersion;
	tailwindRange?: string;
	cssTarget: string;
	peerDeps: string[];
	installed: MaybeInstallResult;
	srcLayout: boolean;
	/**
	 * When false, skip the MCP-server config write. Threaded through from
	 * `InitOptions.mcp` so the summary can honor `--no-mcp` without re-reading
	 * the caller's options shape.
	 */
	mcp?: boolean;
}

function printSummary(p: SummaryParams) {
	const versionTag = `Tailwind ${p.tailwindVersion}${p.tailwindRange ? ` (${p.tailwindRange})` : ""}`;
	console.log(`Detected ${versionTag}.`);
	if (p.srcLayout) {
		console.log(pc.dim(`Detected src/ layout — components will be written under src/components/.`));
	}
	console.log(CONFIG_WRITE_MESSAGE[p.wroteConfig]);
	console.log(
		p.wroteCss.skipped
			? `Skipped ${p.cssTarget} (already exists; pass --overwrite=globals.css to replace).`
			: `Wrote ${p.cssTarget}`,
	);
	if (p.tailwindVersion === "v3") {
		console.log(
			p.wroteTwConfig.skipped
				? "Skipped tailwind.config.ts (already exists; pass --overwrite=tailwind.config.ts to replace)."
				: "Wrote tailwind.config.ts",
		);
	}

	if (!p.installed.ran && p.installed.installed.length === 0 && p.installed.skipped.length === p.peerDeps.length && p.installed.exitCode === undefined && p.installed.manager !== "(skipped)") {
		console.log(`Peer deps already present: ${p.peerDeps.join(", ")}`);
	} else if (p.installed.manager === "(skipped)") {
		console.log(`\nSkipping auto-install (--no-install). Run yourself:`);
		console.log(`  pnpm add ${p.peerDeps.join(" ")}`);
	} else if (p.installed.exitCode !== undefined && p.installed.exitCode !== 0) {
		console.log(`\nPeer-dep install via ${p.installed.manager} exited with code ${p.installed.exitCode}.`);
		console.log(`Run yourself: ${p.installed.manager} ${p.installed.manager === "npm" ? "install" : "add"} ${p.installed.installed.join(" ")}`);
	}

	// Wire @hex-core/mcp into the consumer's AI-tool config (Claude Code
	// `.mcp.json` / Cursor / Continue) so list_themes / get_theme /
	// customize_component are reachable from the agent that just installed
	// the registry. Opt-in only: `.mcp.json` is commit-tracked and
	// auto-loaded, so `hex init` doesn't write it without `--mcp`.
	if (p.mcp === true) {
		const result = writeMcpEntry(process.cwd());
		if (result.wrote) {
			console.log(`\nWrote @hex-core/mcp entry to ${result.target}.`);
			console.log(`  Restart your AI session to pick it up.`);
		} else if (result.alreadyConfigured) {
			console.log(`\n@hex-core/mcp already configured in ${result.target} — skipping.`);
		} else if (result.malformed) {
			console.log(`\nWarning: ${result.target} isn't valid JSON — skipping MCP wiring.`);
			console.log(`  Fix the file and re-run \`hex init --mcp\`.`);
		}
	} else {
		console.log(`\nTip: pass --mcp to wire @hex-core/mcp into your AI tool, or see ${MCP_DOCS_URL}`);
	}

	console.log("\nNext: hex add button input label");
	console.log(`Theme tweaking: ${STUDIO_URL} — copy the payload back into your AI session.`);
	printSkillsHint(process.cwd());
}
