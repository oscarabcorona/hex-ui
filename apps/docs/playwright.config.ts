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
	 * CI runs against the prod build (`next build && next start`) to catch
	 * prod-only regressions (different chunking, no HMR overlays, real SSR).
	 * Local runs use `next dev` for fast HMR + `test:ui` iteration; set CI=1
	 * to mirror CI locally.
	 */
	webServer: {
		command: process.env.CI ? "pnpm build && pnpm start" : "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
