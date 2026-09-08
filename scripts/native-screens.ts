/**
 * Capture the docs screenshots for every `@hex-core/native` component.
 *
 * The docs site cannot render a React Native component, so each native page
 * shows a committed screenshot pair instead. This drives the Expo playground
 * on a booted iOS simulator, deep-links to one demo at a time in each colour
 * scheme, and writes `apps/docs/public/native/<name>.<scheme>.png`.
 *
 * darwin-only and deliberately NOT wired into CI — same posture as the
 * Playwright visual baselines, which also need a real renderer. The CI gate
 * for native is `scripts/smoke-native.sh`, which bundles without a device.
 *
 * The committed PNGs are both the docs asset and the visual baseline: a
 * change to a native component shows up as an image diff in review.
 *
 *   pnpm run native:screens            # every component
 *   pnpm run native:screens -- button  # just one
 *
 * Prerequisites, checked below and reported rather than assumed:
 *   1. macOS with Xcode command-line tools (`xcrun simctl`)
 *   2. A booted iOS simulator
 *   3. The playground running: pnpm --filter native-playground start
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const NATIVE_SRC = join(ROOT, "packages/native/src");
const OUT_DIR = join(ROOT, "apps/docs/public/native");
const SCHEMES = ["light", "dark"] as const;

/** Category directories the native package ships components in. */
const CATEGORY_DIRS = ["primitives", "components", "ai"];

/** How long to let a screen settle before capturing, in milliseconds. */
const SETTLE_MS = 1200;

/**
 * Run a command, returning its stdout.
 * @param command - Executable name
 * @param args - Arguments
 * @returns Trimmed stdout
 * @throws {Error} When the command exits non-zero
 */
function run(command: string, args: string[]): string {
	return execFileSync(command, args, { encoding: "utf-8" }).trim();
}

/**
 * Fail with a message the reader can act on.
 * @param message - What went wrong and what to do about it
 * @throws {never} Exits the process rather than returning
 */
function fail(message: string): never {
	console.error(`native-screens: ${message}`);
	process.exit(1);
}

/**
 * Every native component slug, from the filesystem rather than the registry
 * so this works before a registry build.
 * @returns Sorted slugs, unprefixed
 */
function nativeSlugs(): string[] {
	const slugs: string[] = [];
	for (const category of CATEGORY_DIRS) {
		const dir = join(NATIVE_SRC, category);
		if (!existsSync(dir)) continue;
		for (const entry of readdirSync(dir).sort()) {
			if (existsSync(join(dir, entry, `${entry}.demo.tsx`))) slugs.push(entry);
		}
	}
	return slugs;
}

/**
 * Sleep, so a screen has time to finish animating before capture.
 * @param ms - Milliseconds to wait
 * @returns A promise that resolves after the delay
 */
function settle(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

if (process.platform !== "darwin") {
	fail("iOS simulator capture needs macOS. Run this on a Mac, or skip — CI uses scripts/smoke-native.sh instead.");
}

try {
	run("xcrun", ["--find", "simctl"]);
} catch {
	fail("`xcrun simctl` not found. Install the Xcode command-line tools.");
}

const booted = run("xcrun", ["simctl", "list", "devices", "booted"]);
if (!booted.includes("(Booted)")) {
	fail("No booted iOS simulator. Open one (Simulator.app) and run the playground: pnpm --filter native-playground start");
}

const available = nativeSlugs();
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
// Validate before capturing anything. `simctl openurl` exits 0 for a route
// that does not exist, so a typo (`buton`, or the prefixed `native-button`)
// used to deep-link nowhere, screenshot whatever was on screen, and write it
// to `native-buton.light.png` — a committed baseline of the wrong thing.
const unknown = requested.filter((slug) => !available.includes(slug));
if (unknown.length > 0) {
	fail(
		`Unknown demo slug(s): ${unknown.join(", ")}.\n` +
			`  Pass the unprefixed slug (\`button\`, not \`native-button\`).\n` +
			`  Available: ${available.join(", ")}`,
	);
}
const slugs = requested.length > 0 ? requested : available;
if (slugs.length === 0) fail("No native demos found under packages/native/src.");

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Capturing ${slugs.length} component(s) × ${SCHEMES.length} schemes…`);

for (const slug of slugs) {
	for (const scheme of SCHEMES) {
		// The playground reads `scheme` from the URL so this needs no UI
		// driving — deep-link straight to the demo in the right theme.
		const url = `hexplayground://component/${slug}?scheme=${scheme}`;
		try {
			run("xcrun", ["simctl", "openurl", "booted", url]);
		} catch {
			fail(`Could not deep-link ${url}. Is the playground running on the booted simulator?`);
		}
		await settle(SETTLE_MS);

		const out = join(OUT_DIR, `native-${slug}.${scheme}.png`);
		try {
			run("xcrun", ["simctl", "io", "booted", "screenshot", "--type=png", out]);
		} catch {
			fail(`Screenshot failed for ${slug} (${scheme}).`);
		}
		console.log(`  → apps/docs/public/native/native-${slug}.${scheme}.png`);
	}
}

console.log(`\n✓ Captured ${String(slugs.length * SCHEMES.length)} screenshots.`);
console.log("Review the diff before committing — these PNGs are the visual baseline.");
