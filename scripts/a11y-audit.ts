/**
 * A11y audit — boots the docs site and runs axe-core on every component
 * demo page in light + dark mode. Aggregates violations by id + impact and
 * emits a JSON + markdown report at the repo root. Exits non-zero if any
 * violation has impact "critical" or "serious", or if any page fails to scan.
 *
 * Convention follows scripts/build-registry.ts (ESM, no shebang, run via tsx).
 *
 *   pnpm run a11y-audit               # default: full scan, fails on critical|serious
 *   pnpm run a11y-audit -- --dry-run  # boot the server but skip writing reports
 *   pnpm run a11y-audit -- --slug button --slug card  # restrict to a few pages
 */
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium, type Browser, type Page } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..");
const REGISTRY_INDEX = join(REPO_ROOT, "registry", "registry.json");
const REPORT_JSON = join(REPO_ROOT, "a11y-report.json");
const REPORT_MD = join(REPO_ROOT, "a11y-report.md");
const PORT = Number(process.env.A11Y_PORT ?? 3010);
const BASE_URL = `http://localhost:${PORT}`;
const READY_TIMEOUT_MS = 90_000;
const PAGE_TIMEOUT_MS = 30_000;

interface CliFlags {
	dryRun: boolean;
	slugs: string[] | null;
	failOn: ("minor" | "moderate" | "serious" | "critical")[];
}

interface ViolationNode {
	target: string[];
	html: string;
	failureSummary?: string;
}

interface AggregatedViolation {
	id: string;
	impact: "minor" | "moderate" | "serious" | "critical" | null;
	help: string;
	helpUrl: string;
	occurrences: Array<{
		slug: string;
		mode: "light" | "dark";
		nodes: ViolationNode[];
	}>;
}

interface PageScanResult {
	slug: string;
	url: string;
	mode: "light" | "dark";
	violations: Array<{
		id: string;
		impact: "minor" | "moderate" | "serious" | "critical" | null;
		help: string;
		helpUrl: string;
		nodes: ViolationNode[];
	}>;
}

/**
 * A page that could not be scanned. Recorded so that a page which never
 * loaded cannot be mistaken for one that loaded with zero violations.
 */
interface ScanFailure {
	slug: string;
	url: string;
	mode: "light" | "dark";
	message: string;
}

interface Report {
	generatedAt: string;
	pagesScanned: number;
	pagesFailed: number;
	violations: AggregatedViolation[];
	failingImpact: ("minor" | "moderate" | "serious" | "critical")[];
	summary: { critical: number; serious: number; moderate: number; minor: number };
	scanFailures: ScanFailure[];
}

/**
 * Parse CLI flags from `process.argv.slice(2)`.
 * @param argv - Argument list excluding `node` and the script path.
 * @returns Parsed flags with defaults applied.
 */
function parseFlags(argv: string[]): CliFlags {
	const flags: CliFlags = {
		dryRun: false,
		slugs: null,
		failOn: ["critical", "serious"],
	};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--dry-run") flags.dryRun = true;
		else if (arg === "--slug" && argv[i + 1]) {
			(flags.slugs ??= []).push(argv[++i] as string);
		}
	}
	return flags;
}

/**
 * Render target of a registry item. The registry omits `platform` for web
 * items, so absence means web — mirrors `platformOf()` in the docs app.
 */
type Platform = "web" | "native";

/** A page to scan: the registry slug plus the surface that renders it. */
interface ScanTarget {
	slug: string;
	platform: Platform;
}

/**
 * Read every component from the registry index, tagged with its platform.
 * The index is the same source the docs app builds its routes from, so every
 * target listed here has a page — unlike a bare directory listing of
 * `registry/items/`, which also yields the native items that the web
 * catalogue deliberately excludes from `/docs/components/*`.
 * @returns Scan targets sorted by slug.
 */
function listScanTargets(): ScanTarget[] {
	const index = JSON.parse(readFileSync(REGISTRY_INDEX, "utf8")) as {
		items: Array<{ name: string; platform?: Platform }>;
	};
	return index.items
		.map((item) => ({ slug: item.name, platform: item.platform ?? "web" }))
		.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Resolve `--slug` arguments against the registry index.
 * @param slugs - Slugs requested on the command line.
 * @returns The matching scan targets, in the order requested.
 * @throws {Error} If a slug names no registry item — a typo would otherwise be
 * scanned as a 404 page.
 */
function resolveTargets(slugs: string[]): ScanTarget[] {
	const bySlug = new Map(listScanTargets().map((t) => [t.slug, t]));
	return slugs.map((slug) => {
		const target = bySlug.get(slug);
		if (!target) {
			throw new Error(`Unknown --slug '${slug}': no registry item by that name.`);
		}
		return target;
	});
}

/**
 * URL of the docs page that renders a target. Native items render through
 * `react-native`, so the docs app excludes them from `/docs/components/*`
 * (see `listComponents()`) and gives them their own `/native/*` surface.
 * Sending them to the web route yields `NoFallbackError`, because that route
 * sets `dynamicParams = false`.
 * @param target - The component to locate.
 * @returns Absolute URL on the audit server.
 */
function pageUrl(target: ScanTarget): string {
	return target.platform === "native"
		? `${BASE_URL}/native/${target.slug}`
		: `${BASE_URL}/docs/components/${target.slug}`;
}

/**
 * Resolve if `PORT` is free, reject with a helpful error if it's already
 * bound — avoids the otherwise-opaque 90s ready timeout when something else
 * is squatting on 3010.
 */
async function assertPortAvailable(): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		const probe = createServer();
		probe.once("error", (err: NodeJS.ErrnoException) => {
			if (err.code === "EADDRINUSE") {
				reject(
					new Error(
						`Port ${PORT} is already in use. Stop the existing process or set A11Y_PORT to a free port.`,
					),
				);
			} else {
				reject(err);
			}
		});
		probe.once("listening", () => {
			probe.close((closeErr) => (closeErr ? reject(closeErr) : resolve()));
		});
		probe.listen(PORT, "127.0.0.1");
	});
}

/**
 * Spawn `next start` for the docs app on `PORT` and resolve when the server
 * answers HTTP. Caller is responsible for `proc.kill('SIGTERM')`.
 *
 * Polls the port via `fetch` rather than scraping stdout banners — banner
 * strings change between Next versions, but a 2xx/3xx response is a stable
 * readiness signal.
 * @returns The child process and a `ready` promise that settles when the
 *   server answers HTTP (or rejects on early exit / timeout).
 */
async function startDocsServer(): Promise<{ proc: ChildProcess; ready: Promise<void> }> {
	await assertPortAvailable();

	const proc = spawn("pnpm", ["--filter", "docs", "exec", "next", "start", "-p", String(PORT)], {
		cwd: REPO_ROOT,
		stdio: ["ignore", "pipe", "pipe"],
		env: { ...process.env, PORT: String(PORT) },
	});

	const recentOutput: string[] = [];
	const onChunk = (chunk: Buffer): void => {
		const text = chunk.toString();
		process.stdout.write(`[docs] ${text}`);
		recentOutput.push(text);
		if (recentOutput.length > 40) recentOutput.shift();
	};
	proc.stdout?.on("data", onChunk);
	proc.stderr?.on("data", onChunk);

	const ready = new Promise<void>((resolve, reject) => {
		let exited = false;
		proc.on("exit", (code) => {
			exited = true;
			reject(
				new Error(
					`docs server exited with code ${code} before ready. Recent output:\n${recentOutput.join("")}`,
				),
			);
		});

		(async () => {
			const deadline = Date.now() + READY_TIMEOUT_MS;
			while (!exited && Date.now() < deadline) {
				try {
					const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
					if (res.ok || (res.status >= 300 && res.status < 400)) {
						resolve();
						return;
					}
				} catch {
					// Server not up yet; keep polling.
				}
				await delay(250);
			}
			if (!exited) {
				reject(
					new Error(
						`docs server did not answer HTTP at ${BASE_URL} within ${READY_TIMEOUT_MS}ms. Recent output:\n${recentOutput.join("")}`,
					),
				);
			}
		})();
	});

	return { proc, ready };
}

/**
 * Navigate to the target's docs page, force the requested theme by toggling
 * the `dark` class on `<html>`, and run axe-core against the page.
 * @param page - Playwright page reused across slugs.
 * @param target - Component to scan, with the surface that renders it.
 * @param mode - Which colour scheme to force before scanning.
 * @returns The page's axe results normalized into `PageScanResult`.
 */
async function scanPage(
	page: Page,
	target: ScanTarget,
	mode: "light" | "dark",
): Promise<PageScanResult> {
	const url = pageUrl(target);
	// next-themes is configured with defaultTheme="system" + enableSystem, so
	// emulating prefers-color-scheme is the canonical way to flip the docs
	// site into the requested palette. Setting <html class="dark"> directly
	// races with next-themes' MutationObserver and gets reverted.
	//
	// Also force reduced-motion: this neutralizes WAAPI animations on motion
	// demos (FadeIn / SlideIn / ScaleIn / BlurIn / Stagger) so axe-core
	// samples the *final* rendered state instead of catching mid-animation
	// opacity / blur values that fail color-contrast.
	await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
	await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });
	// Wait for hydration signals AND for next-themes to apply the dark class.
	// Some registry items legitimately have no live demo (motion-pro adapter,
	// pure-type primitives like `transition`, label-only Track) — in that case
	// no `[role="tabpanel"]` exists, but the Installation section heading is
	// always rendered for every slug, so we fall back to that as the gate.
	const tabpanel = page.locator('[role="tabpanel"]').first();
	const installHeading = page.locator('h2#installation, [id="installation"]').first();
	await Promise.race([
		tabpanel.waitFor({ state: "visible", timeout: PAGE_TIMEOUT_MS }),
		installHeading.waitFor({ state: "visible", timeout: PAGE_TIMEOUT_MS }),
	]);
	await page.waitForFunction(
		(m) => document.documentElement.classList.contains("dark") === (m === "dark"),
		mode,
		{ timeout: PAGE_TIMEOUT_MS },
	);
	// Exclude xterm.js internals — the Terminal component embeds a third-party
	// canvas widget whose offscreen helper textarea (used for IME/keyboard
	// input capture) trips color-contrast against the canvas-painted bg that
	// axe-core can't read. The visible terminal grid is already audited via
	// the rendered `.xterm-rows` / `.xterm-screen` nodes themselves.
	const results = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa", "wcag22a", "wcag22aa"])
		.exclude(".xterm-helper-textarea")
		.exclude(".xterm-char-measure-element")
		.analyze();
	return {
		slug: target.slug,
		url,
		mode,
		violations: results.violations.map((v) => ({
			id: v.id,
			impact: (v.impact ?? null) as PageScanResult["violations"][number]["impact"],
			help: v.help,
			helpUrl: v.helpUrl,
			nodes: v.nodes.map((n) => ({
				target: n.target as string[],
				html: n.html,
				failureSummary: n.failureSummary,
			})),
		})),
	};
}

/**
 * Group per-page violations by axe rule id and sort by impact (critical first).
 * @param results - Per-page scan results.
 * @returns One entry per violating rule with all (slug, mode, nodes) occurrences.
 */
function aggregate(results: PageScanResult[]): AggregatedViolation[] {
	const byId = new Map<string, AggregatedViolation>();
	for (const result of results) {
		for (const v of result.violations) {
			let agg = byId.get(v.id);
			if (!agg) {
				agg = { id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, occurrences: [] };
				byId.set(v.id, agg);
			}
			agg.occurrences.push({ slug: result.slug, mode: result.mode, nodes: v.nodes });
		}
	}
	return [...byId.values()].sort((a, b) => {
		const impactRank = { critical: 0, serious: 1, moderate: 2, minor: 3 } as const;
		const aRank = a.impact ? impactRank[a.impact] : 4;
		const bRank = b.impact ? impactRank[b.impact] : 4;
		return aRank - bRank;
	});
}

/**
 * Count nodes per impact level across all aggregated violations.
 * @param violations - Output of {@link aggregate}.
 * @returns Totals for the gate to compare against `flags.failOn`.
 */
function summarize(violations: AggregatedViolation[]): Report["summary"] {
	const summary = { critical: 0, serious: 0, moderate: 0, minor: 0 };
	for (const v of violations) {
		if (v.impact && v.impact in summary) {
			summary[v.impact] += v.occurrences.reduce((acc, o) => acc + o.nodes.length, 0);
		}
	}
	return summary;
}

/**
 * Write a human-readable markdown report alongside the JSON one.
 * @param report - Audit report to render.
 */
function writeMarkdown(report: Report): void {
	const lines: string[] = [];
	lines.push(`# A11y audit — ${report.generatedAt}`);
	lines.push("");
	lines.push(
		`Page scans: **${report.pagesScanned}** completed, **${report.pagesFailed}** failed ` +
			"(light + dark modes each)",
	);
	lines.push(
		`Violations: **${report.summary.critical} critical · ${report.summary.serious} serious · ${report.summary.moderate} moderate · ${report.summary.minor} minor**`,
	);
	lines.push("");
	lines.push(`Gate fails on: ${report.failingImpact.join(", ")}.`);
	lines.push("");
	if (report.scanFailures.length > 0) {
		lines.push(`## ⚠️ ${report.scanFailures.length} page scan(s) failed`);
		lines.push("");
		lines.push("These pages were **not** audited — the totals above are incomplete.");
		lines.push("");
		for (const f of report.scanFailures) {
			lines.push(`- \`${f.slug}\` (${f.mode}) — ${f.url} — ${f.message}`);
		}
		lines.push("");
	}
	if (report.violations.length === 0) {
		lines.push("✅ Zero violations across the scanned pages.");
	} else {
		for (const v of report.violations) {
			lines.push(`## ${v.id} (${v.impact ?? "unknown"})`);
			lines.push("");
			lines.push(`> ${v.help}`);
			lines.push("");
			lines.push(`Reference: ${v.helpUrl}`);
			lines.push("");
			for (const occ of v.occurrences) {
				lines.push(`- \`${occ.slug}\` (${occ.mode}) — ${occ.nodes.length} node(s)`);
				for (const n of occ.nodes.slice(0, 3)) {
					lines.push(`  - selector: \`${n.target.join(" ")}\``);
					if (n.failureSummary) {
						lines.push(`    summary: ${n.failureSummary.replace(/\n/g, " ")}`);
					}
				}
				if (occ.nodes.length > 3) {
					lines.push(`  - …${occ.nodes.length - 3} more`);
				}
			}
			lines.push("");
		}
	}
	writeFileSync(REPORT_MD, lines.join("\n"));
}

/** Entry point. Boots the docs server, scans every slug, writes reports, exits. */
async function main(): Promise<void> {
	const flags = parseFlags(process.argv.slice(2));
	const targets = flags.slugs ? resolveTargets(flags.slugs) : listScanTargets();
	const nativeCount = targets.filter((t) => t.platform === "native").length;
	console.log(
		`a11y-audit: scanning ${targets.length} pages in light + dark ` +
			`(${targets.length - nativeCount} web, ${nativeCount} native)`,
	);

	const { proc, ready } = await startDocsServer();
	let browser: Browser | null = null;
	let cleanedUp = false;

	/** Close the browser and stop the docs server. Safe to call more than once. */
	async function cleanup(): Promise<void> {
		if (cleanedUp) return;
		cleanedUp = true;
		if (browser) {
			try {
				await browser.close();
			} catch {
				// browser already closed
			}
		}
		if (proc.exitCode === null && proc.signalCode === null) {
			proc.kill("SIGTERM");
			await new Promise<void>((resolve) => {
				const timer = setTimeout(() => {
					proc.kill("SIGKILL");
					resolve();
				}, 5_000);
				proc.once("exit", () => {
					clearTimeout(timer);
					resolve();
				});
			});
		}
	}

	const onSignal = (sig: NodeJS.Signals): void => {
		void cleanup().finally(() => process.exit(sig === "SIGINT" ? 130 : 143));
	};
	process.on("SIGINT", onSignal);
	process.on("SIGTERM", onSignal);

	try {
		await ready;
		// Kept in a non-null local: `browser` is declared nullable for `cleanup()`,
		// and TypeScript cannot narrow a mutable outer binding inside the worker
		// closures below.
		const launchedBrowser = await chromium.launch();
		browser = launchedBrowser;

		// Worker pool: one persistent context per worker (each enforces its
		// own colorScheme via emulateMedia in scanPage), pulling jobs off a
		// shared queue. Concurrency tuned for CI runners (2 vCPU) — going
		// above ~4 thrashes the Next prod server.
		const jobs: Array<{ target: ScanTarget; mode: "light" | "dark" }> = [];
		for (const target of targets) {
			for (const mode of ["light", "dark"] as const) {
				jobs.push({ target, mode });
			}
		}
		const concurrency = Number(process.env.A11Y_CONCURRENCY ?? 4);
		const results: PageScanResult[] = [];
		const failures: ScanFailure[] = [];
		let cursor = 0;
		await Promise.all(
			Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
				const context = await launchedBrowser.newContext();
				const page = await context.newPage();
				try {
					while (cursor < jobs.length) {
						const job = jobs[cursor++];
						if (!job) break;
						const { target, mode } = job;
						try {
							const result = await scanPage(page, target, mode);
							results.push(result);
							if (result.violations.length > 0) {
								console.log(`  ✗ ${target.slug} (${mode}): ${result.violations.length} rule(s)`);
							} else {
								console.log(`  ✓ ${target.slug} (${mode})`);
							}
						} catch (err) {
							const message = (err as Error).message;
							console.error(`  ! ${target.slug} (${mode}): scan failed — ${message}`);
							failures.push({ slug: target.slug, url: pageUrl(target), mode, message });
						}
					}
				} finally {
					await context.close().catch(() => {});
				}
			}),
		);

		const violations = aggregate(results);
		const summary = summarize(violations);
		const report: Report = {
			generatedAt: new Date().toISOString(),
			pagesScanned: results.length,
			pagesFailed: failures.length,
			violations,
			failingImpact: flags.failOn,
			summary,
			scanFailures: failures,
		};

		if (!flags.dryRun) {
			mkdirSync(dirname(REPORT_JSON), { recursive: true });
			writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`);
			writeMarkdown(report);
			console.log(`\nWrote ${REPORT_JSON} + ${REPORT_MD}`);
		}

		console.log(
			`\nSummary: ${summary.critical} critical · ${summary.serious} serious · ${summary.moderate} moderate · ${summary.minor} minor`,
		);

		const failingCount = flags.failOn.reduce((acc, lvl) => acc + summary[lvl], 0);
		if (failingCount > 0) {
			console.error(`\nFailing on ${flags.failOn.join("/")}: ${failingCount} violation(s).`);
			process.exitCode = 1;
		}
		// A page that never loaded reports no violations, so without this gate a
		// broken route is indistinguishable from a clean one and the audit passes
		// green while leaving that page unaudited.
		if (failures.length > 0) {
			console.error(`\n${failures.length} scan(s) failed — those pages were NOT audited:`);
			for (const f of failures) {
				console.error(`  ! ${f.slug} (${f.mode}) ${f.url} — ${f.message}`);
			}
			process.exitCode = 1;
		}
		if (failingCount === 0 && failures.length === 0) {
			console.log("\n✅ No critical/serious violations.");
		}
	} finally {
		await cleanup();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
