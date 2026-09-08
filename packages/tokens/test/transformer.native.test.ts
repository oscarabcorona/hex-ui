/**
 * Contract tests for the React Native token target.
 *
 * Locks down the NativeWind `global.css` shape and the `themeToNativeTheme`
 * maps that `hex init --platform native` and a native theme provider consume.
 */
import { type Theme } from "@hex-core/registry";
import { describe, expect, it } from "vitest";
import {
	defaultTheme,
	emberTheme,
	generateGlobalsCss,
	generateGlobalsCssNative,
	midnightTheme,
	themeToFlatJson,
	themeToNativeTheme,
} from "../src/index.js";

const allThemes: Array<[string, Theme]> = [
	["default", defaultTheme],
	["midnight", midnightTheme],
	["ember", emberTheme],
];

/** A bare `H S% L%` triplet — what every colour token must resolve to. */
const HSL_TRIPLET = /^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%$/;

describe("themeToNativeTheme", () => {
	it.each(allThemes)("returns light and dark maps keyed by --<token> for %s", (_name, theme) => {
		const native = themeToNativeTheme(theme);
		expect(Object.keys(native).sort()).toEqual(["dark", "light"]);
		for (const map of [native.light, native.dark]) {
			for (const key of Object.keys(map)) expect(key.startsWith("--")).toBe(true);
			expect(map["--background"]).toBeDefined();
			expect(map["--primary"]).toBeDefined();
		}
	});

	it("matches themeToFlatJson for each mode", () => {
		const native = themeToNativeTheme(defaultTheme);
		expect(native.light).toEqual(themeToFlatJson(defaultTheme, "light"));
		expect(native.dark).toEqual(themeToFlatJson(defaultTheme, "dark"));
	});

	it("resolves palette references to literal triplets, never var()", () => {
		const native = themeToNativeTheme(defaultTheme);
		for (const map of [native.light, native.dark]) {
			for (const [key, value] of Object.entries(map)) {
				expect(value, key).not.toMatch(/var\(/);
			}
			expect(map["--primary"]).toMatch(HSL_TRIPLET);
		}
	});
});

describe("generateGlobalsCssNative", () => {
	const css = generateGlobalsCssNative(defaultTheme);

	it("is what generateGlobalsCss emits for target: native", () => {
		expect(generateGlobalsCss(defaultTheme, { target: "native" })).toBe(css);
	});

	it("starts with the three Tailwind v3 directives", () => {
		expect(css.startsWith("@tailwind base;\n@tailwind components;\n@tailwind utilities;")).toBe(true);
	});

	it("declares :root and .dark:root inside @layer base", () => {
		expect(css).toContain("@layer base {");
		expect(css).toContain("  :root {");
		expect(css).toContain("  .dark:root {");
		expect(css).not.toContain("\n  .dark {");
	});

	it("emits every token in both modes with resolved literals", () => {
		const { light, dark } = themeToNativeTheme(defaultTheme);
		for (const [key, value] of Object.entries(light)) expect(css).toContain(`${key}: ${value};`);
		for (const [key, value] of Object.entries(dark)) expect(css).toContain(`${key}: ${value};`);
		expect(css).not.toMatch(/var\(--/);
	});

	it("omits the palette ramp tier", () => {
		for (const key of Object.keys(defaultTheme.palette ?? {})) {
			expect(css).not.toContain(`--${key}:`);
		}
	});

	it("emits no universal or body rules", () => {
		expect(css).not.toMatch(/^\s*\*\s*\{/m);
		expect(css).not.toMatch(/^\s*body\s*\{/m);
		expect(css).not.toContain("@apply");
	});

	it.each(allThemes)("produces a parseable shape for %s", (_name, theme) => {
		const out = generateGlobalsCssNative(theme);
		const opens = (out.match(/\{/g) ?? []).length;
		const closes = (out.match(/\}/g) ?? []).length;
		expect(opens).toBe(closes);
	});
});
