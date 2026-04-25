/**
 * TokenSet + strictTokenSet contract tests.
 *
 * Locks down the schema authors / Hex Studio depend on:
 * - Open-ended on keys, strict on value shape.
 * - strictTokenSetSchema rejects themes missing required color/radius tokens.
 * - Existing OS preset themes (default, midnight, ember) must satisfy strictThemeSchema.
 */
import { describe, expect, it } from "vitest";
import {
	REQUIRED_COLOR_TOKENS,
	REQUIRED_RADIUS_TOKENS,
	strictThemeSchema,
	strictTokenSetSchema,
	themeSchema,
	tokenSetSchema,
} from "../src/index.js";

const validToken = (type: string, value: string) => ({ type, value });

const completeMinimalTokenSet = (): Record<string, { type: string; value: string }> => {
	const tokens: Record<string, { type: string; value: string }> = {};
	for (const k of REQUIRED_COLOR_TOKENS) tokens[k] = validToken("color", "0 0% 100%");
	for (const k of REQUIRED_RADIUS_TOKENS) tokens[k] = validToken("radius", "0.5rem");
	return tokens;
};

describe("tokenSetSchema (open keys, strict values)", () => {
	it("accepts a flat record of typed tokens", () => {
		const result = tokenSetSchema.safeParse({
			background: validToken("color", "0 0% 100%"),
			"space-4": validToken("spacing", "1rem"),
		});
		expect(result.success).toBe(true);
	});

	it("rejects a token missing the type field", () => {
		const result = tokenSetSchema.safeParse({
			background: { value: "0 0% 100%" },
		});
		expect(result.success).toBe(false);
	});

	it("rejects a token with an unknown type", () => {
		const result = tokenSetSchema.safeParse({
			background: { type: "haunted", value: "0 0% 100%" },
		});
		expect(result.success).toBe(false);
	});

	it("rejects a token with a non-string value", () => {
		const result = tokenSetSchema.safeParse({
			"space-4": { type: "spacing", value: 16 },
		});
		expect(result.success).toBe(false);
	});
});

describe("strictTokenSetSchema (requires color + radius)", () => {
	it("accepts a token set that has all required tokens", () => {
		const result = strictTokenSetSchema.safeParse(completeMinimalTokenSet());
		expect(result.success).toBe(true);
	});

	it("rejects a token set missing a required color token", () => {
		const tokens = completeMinimalTokenSet();
		delete tokens.background;
		const result = strictTokenSetSchema.safeParse(tokens);
		expect(result.success).toBe(false);
	});

	it("rejects a token set missing the radius token", () => {
		const tokens = completeMinimalTokenSet();
		delete tokens.radius;
		const result = strictTokenSetSchema.safeParse(tokens);
		expect(result.success).toBe(false);
	});

	it("accepts additional optional tokens beyond the required set", () => {
		const tokens = completeMinimalTokenSet();
		tokens["space-4"] = validToken("spacing", "1rem");
		tokens["control-height-md"] = validToken("dimension", "2.5rem");
		const result = strictTokenSetSchema.safeParse(tokens);
		expect(result.success).toBe(true);
	});
});

describe("strictThemeSchema (theme-level validation)", () => {
	it("validates a complete theme with light + dark", () => {
		const result = strictThemeSchema.safeParse({
			name: "test",
			displayName: "Test",
			description: "Test theme",
			tokens: {
				light: completeMinimalTokenSet(),
				dark: completeMinimalTokenSet(),
			},
		});
		expect(result.success).toBe(true);
	});

	it("rejects a theme where dark is missing required tokens", () => {
		const incompleteDark = completeMinimalTokenSet();
		delete incompleteDark.foreground;
		const result = strictThemeSchema.safeParse({
			name: "test",
			displayName: "Test",
			description: "Test theme",
			tokens: {
				light: completeMinimalTokenSet(),
				dark: incompleteDark,
			},
		});
		expect(result.success).toBe(false);
	});
});

describe("themeSchema (loose, runtime parsing)", () => {
	it("still accepts the same complete theme as strictThemeSchema", () => {
		const result = themeSchema.safeParse({
			name: "test",
			displayName: "Test",
			description: "Test theme",
			tokens: {
				light: completeMinimalTokenSet(),
				dark: completeMinimalTokenSet(),
			},
		});
		expect(result.success).toBe(true);
	});

	it("accepts an incomplete token set (loose mode)", () => {
		const result = themeSchema.safeParse({
			name: "test",
			displayName: "Test",
			description: "Test theme",
			tokens: {
				light: { background: validToken("color", "0 0% 100%") },
				dark: { background: validToken("color", "0 0% 0%") },
			},
		});
		expect(result.success).toBe(true);
	});
});
