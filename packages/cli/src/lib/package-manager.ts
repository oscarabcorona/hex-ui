import * as fs from "node:fs";
import * as path from "node:path";

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm";

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

/**
 * Detect which package manager the consumer's project uses by looking for
 * its lockfile in `cwd`. Order matches the conventional precedence — if
 * multiple lockfiles exist (rare, usually a migration in progress) the
 * earliest match wins. Falls back to npm when no lockfile is present.
 */
export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
	if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
	if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
	if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
	if (fs.existsSync(path.join(cwd, "package-lock.json"))) return "npm";
	return "npm";
}

/**
 * Split an npm specifier into its package name.
 * @param spec - An npm specifier, with or without a range
 * @returns The package name alone
 * @example
 * `packageNameOf("@scope/pkg@^1.2.3")` → `"@scope/pkg"`
 */
export function packageNameOf(spec: string): string {
	// A scoped name keeps its leading `@`; the range separator is the LAST `@`
	// when one appears after the first character. `@scope/pkg` → `@scope/pkg`,
	// `@scope/pkg@^1.2.3` → `@scope/pkg`, `pkg@^1` → `pkg`.
	const at = spec.lastIndexOf("@");
	return at > 0 ? spec.slice(0, at) : spec;
}

/**
 * The major version a range asks for, when it states one unambiguously.
 * @param range - An npm range such as `^3.4.0`, `~4.1`, `>=0.78.0`, `19.2.5`
 * @returns The major number, or null for a range with no single major
 */
function majorOf(range: string): number | null {
	const match = /^[\^~]?v?(\d+)\./.exec(range.trim()) ?? /^[\^~]?v?(\d+)$/.exec(range.trim());
	if (!match) return null;
	const major = Number(match[1]);
	return Number.isFinite(major) ? major : null;
}

/** One dependency the project already has at an incompatible major. */
export interface DependencyConflict {
	/** Package name. */
	name: string;
	/** The major this project needs, as the candidate spec states it. */
	required: string;
	/** What the consumer's package.json currently declares. */
	installed: string;
}

/**
 * Find candidates the project already declares at a DIFFERENT major.
 *
 * {@link filterMissingDeps} compares on the package name, so an installed
 * `tailwindcss@^4` counts as satisfying a required `tailwindcss@^3.4.0` and
 * is dropped from the install list. That is right — silently majoring a
 * project down is worse — but it must not be silent: NativeWind 4 cannot
 * load a Tailwind v4 config, and the result was an unstyled app with a
 * clean `hex init`.
 * @param cwd - Project root
 * @param candidates - The specs the command wants to install
 * @returns One entry per candidate whose declared major differs
 */
export function findConflictingDeps(cwd: string, candidates: string[]): DependencyConflict[] {
	const pkgPath = path.join(cwd, "package.json");
	if (!fs.existsSync(pkgPath)) return [];
	let pkg: PackageJson;
	try {
		pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as PackageJson;
	} catch {
		return [];
	}
	const declared = { ...pkg.dependencies, ...pkg.devDependencies };
	const conflicts: DependencyConflict[] = [];
	for (const spec of candidates) {
		const name = packageNameOf(spec);
		if (name === spec) continue; // no range requested, nothing to conflict with
		const installed = declared[name];
		if (installed === undefined) continue;
		const wanted = majorOf(spec.slice(name.length + 1));
		const have = majorOf(installed);
		if (wanted === null || have === null || wanted === have) continue;
		conflicts.push({ name, required: spec.slice(name.length + 1), installed });
	}
	return conflicts;
}

/**
 * Return only the npm specifiers that are NOT already declared in the
 * consumer's `package.json` (in either `dependencies` or `devDependencies`).
 * Avoids re-running the install command when nothing actually needs to land.
 * @param cwd - Project root
 * @param candidates - The specs the command wants to install
 * @returns The subset not already declared, by package name
 */
export function filterMissingDeps(cwd: string, candidates: string[]): string[] {
	const pkgPath = path.join(cwd, "package.json");
	if (!fs.existsSync(pkgPath)) return [...candidates];
	let pkg: PackageJson;
	try {
		pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as PackageJson;
	} catch {
		return [...candidates];
	}
	const known = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
	// Compare on the package NAME, not the whole spec. Most registry items list
	// unversioned specs (`clsx`), but the native peer list carries ranges
	// (`tailwindcss@^3.4.0`) — and a literal lookup never matched those, so a
	// project already on Tailwind v4 was handed `pnpm add tailwindcss@^3.4.0`
	// and silently majored down on every init.
	return candidates.filter((spec) => !known.has(packageNameOf(spec)));
}

/**
 * Build the install argv for a given package manager. Caller invokes
 * `spawn(pm, args)` — kept separate from the spawn so it's trivially
 * mockable in tests.
 */
export function installArgv(pm: PackageManager, packages: string[]): string[] {
	switch (pm) {
		case "pnpm":
			return ["add", ...packages];
		case "yarn":
			return ["add", ...packages];
		case "bun":
			return ["add", ...packages];
		case "npm":
			return ["install", ...packages];
	}
}
