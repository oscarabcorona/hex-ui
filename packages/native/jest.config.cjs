/**
 * Jest, not Vitest: this is the one package in the workspace whose tests
 * need the React Native runtime, and Vitest cannot host it. The
 * `@react-native/jest-preset` package (where React Native 0.87 moved the
 * preset) wires the native-module mocks; the transform allowlist lets Babel
 * compile the untranspiled ESM the RN ecosystem ships.
 *
 * The `(\.pnpm/)?` arm matters: pnpm's real paths look like
 * `node_modules/.pnpm/react-native@x/node_modules/react-native/…`, so the
 * allowlist has to match at both `node_modules/` positions.
 *
 * AUTHORING NOTE: in @testing-library/react-native 14 both `render` and
 * `fireEvent` are async — they await `act` internally. A call site that
 * forgets to await gets a Promise instead of the render result and every
 * `screen` query then fails with "`render` function has not been called",
 * which reads like a setup problem but is a missing `await`.
 * @type {import("jest").Config}
 */
module.exports = {
	preset: "@react-native/jest-preset",
	testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
	transformIgnorePatterns: [
		// The markdown stack (micromark, mdast, unist and their helpers) is
		// ESM-only and publishes no CommonJS build. Metro handles that
		// natively; Jest has to be told to transform it.
		"node_modules/(?!(\\.pnpm/)?((jest-)?react-native|@react-native(-community)?|@rn-primitives|nativewind|react-native-css-interop|mdast-util-.*|micromark.*|unist-util-.*|decode-named-character-reference|character-entities.*|devlop|ccount|escape-string-regexp|longest-streak|markdown-table|zwitch|stringify-entities|character-reference-invalid|is-.*-character|parse-entities))",
	],
	// React Native's module graph is large and Babel-transformed on first
	// touch, so the first test in a file routinely takes tens of seconds on a
	// cold CI runner — one took 22s where the whole suite runs in 2s locally.
	// Jest's 5s default is a budget for that startup cost, not for the test,
	// and blowing it reads as a hang rather than a slow import.
	testTimeout: 30_000,
	moduleNameMapper: {
		// Sources import siblings with the ESM `.js` suffix; the files on
		// disk are `.ts(x)`. Same bridge `vitest.base.ts` provides for the
		// web packages.
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
};
