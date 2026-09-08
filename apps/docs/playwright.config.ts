import { defineConfig, devices } from "@playwright/test";

/**
 * Port the suite drives. Overridable because the default is a popular squat
 * target: with `reuseExistingServer` on, an unrelated dev server already
 * holding the port is silently adopted, and whatever it renders ends up in
 * the visual baselines. Set `PLAYWRIGHT_PORT` to run beside one.
 */
const PORT = process.env.PLAYWRIGHT_PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Serve the pre-built app (`next start`) instead of compiling on demand
 * (`next dev`). Always on in CI; `PLAYWRIGHT_PROD=1` opts a local run in.
 *
 * `next dev` compiles each route on first request, so a parallel run makes
 * six workers race the compiler at once. The heavy pages — the `showcase-*`
 * recipes, the motion demos, the audio components — lose that race and blow
 * the 30s navigation budget, which reads as 33 visual "failures" that are
 * really compile timeouts. Against a prod build the same specs finish in
 * seconds. `pnpm regression` sets this; a bare `pnpm test:visual` still gets
 * the fast dev-server watch loop.
 */
const USE_PROD_SERVER = Boolean(process.env.CI || process.env.PLAYWRIGHT_PROD);

/**
 * Local-only Playwright config. `webServer` boots `next dev` on {@link PORT}
 * and tears it down when the run ends. Reuses an already-running dev server
 * when not on CI so `test:ui` is fast in a watch loop.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	/*
	 * Local worker cap. Playwright defaults to `ceil(cpus/2)`, so the pool
	 * scales with whatever machine the suite lands on — 6 on a 12-core box,
	 * more on a bigger one. Past ~4 the workers contend for CPU and
	 * `toHaveScreenshot`'s 5s stability window starts expiring on the heavier
	 * demos, so the run gets slower AND flakier: 6 workers measured 3.3m with
	 * `input` flaking in both themes, 4 workers 2.1m fully green. Matches the
	 * concurrency ceiling `scripts/a11y-audit.ts` already applies. CI keeps the
	 * default, which is already 1 on a 2-vCPU runner.
	 */
	workers: process.env.CI ? undefined : 4,
	use: {
		baseURL: BASE_URL,
		trace: "on-first-retry",
		// Suppresses CSS animations / motion-driven flicker in visual diffs
		// without breaking interaction-driven e2e specs.
		reducedMotion: "reduce",
	},
	// Visual regression tolerance — soaks up subpixel font-AA jitter on
	// the SAME platform. Real visual changes blow past 1% easily, so this
	// stays specific enough. Cross-platform diffs (linux ↔ darwin) far
	// exceed 1% on the same render, which is why per-platform baselines
	// are kept (Playwright default `*-chromium-<os>.png` suffix).
	expect: {
		toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	/*
	 * Prod-server runs (CI, or PLAYWRIGHT_PROD=1) serve a build produced
	 * earlier — by the CI workflow, or by the `pnpm build` step of
	 * `pnpm regression` — so nothing is rebuilt here. They also never adopt an
	 * already-running server, which is what keeps a foreign dev server off the
	 * baselines. Default local runs use `next dev` for a fast watch loop.
	 */
	webServer: {
		command: USE_PROD_SERVER ? `pnpm start -p ${PORT}` : `pnpm dev -p ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: !USE_PROD_SERVER,
		timeout: 180_000,
	},
});
