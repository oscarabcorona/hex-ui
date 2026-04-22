import { defineConfig, devices } from "@playwright/test";

/**
 * Local-only Playwright config. `webServer` boots `next dev` on port 3000 and
 * tears it down when the run ends. Reuses an already-running dev server when
 * not on CI so `test:ui` is fast in a watch loop.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	],
	/*
	 * CI runs against the prod server (`next start`) to catch prod-only
	 * regressions (different chunking, no HMR overlays, real SSR). The build
	 * is produced earlier in the CI workflow; running `pnpm build` here would
	 * rebuild from scratch. For local `CI=1` runs, call `pnpm --filter docs build`
	 * before `pnpm test`. Default local runs use `next dev` for fast iteration.
	 */
	webServer: {
		command: process.env.CI ? "pnpm start" : "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
