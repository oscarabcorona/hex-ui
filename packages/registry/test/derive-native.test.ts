/**
 * Contract tests for `deriveNativeSchema`.
 *
 * Locks down the derivation rules Theme K depends on: the `native-` prefix,
 * the `platform` facet, which fields inherit and which must be rewritten,
 * and the authoring-time guards that catch a typo before the registry build.
 */
import { describe, expect, it } from "vitest";
import {
	componentSchemaDefinition,
	deriveNativeSchema,
	isNativeSlug,
	toNativeSlug,
	type ComponentSchemaInput,
} from "../src/index.js";

const webButton: ComponentSchemaInput = {
	name: "button",
	displayName: "Button",
	description: "A versatile button component with multiple variants and sizes.",
	category: "primitive",
	subcategory: "actions",
	props: [
		{ name: "variant", type: "enum", required: false, description: "Visual style", enumValues: ["default", "ghost"] },
		{ name: "asChild", type: "boolean", required: false, description: "Render as Slot" },
		{ name: "disabled", type: "boolean", required: false, description: "Disable the button" },
	],
	variants: [
		{
			name: "variant",
			description: "Visual style variants",
			values: [{ value: "default", description: "Primary" }],
			default: "default",
		},
	],
	slots: [{ name: "children", description: "Label", required: true, acceptedTypes: ["ReactNode"] }],
	dependencies: { npm: ["@radix-ui/react-slot"], internal: [], peer: ["react", "react-dom"] },
	tokensUsed: ["primary", "primary-foreground"],
	examples: [{ title: "Basic", description: "A button", code: "<Button>Click me</Button>" }],
	ai: {
		whenToUse: "Use for clickable actions: form submissions, confirmations, triggering operations.",
		whenNotToUse: "Don't use for navigation between pages; use a link instead of a button for that.",
		commonMistakes: ["Nesting interactive elements inside asChild button"],
		antiPatterns: [{ mistake: "Using a button to toggle state", insteadUse: "switch", why: "Switch carries the on/off semantic." }],
		relatedComponents: ["toggle", "badge"],
		accessibilityNotes: "Icon-only buttons MUST have aria-label. Loading state automatically sets disabled.",
		tokenBudget: 2265,
	},
	tags: ["button", "action"],
};

const overrides = {
	removeProps: ["asChild"],
	addProps: [{ name: "onPress", type: "function" as const, required: false, description: "Press handler" }],
	dependencies: { npm: ["class-variance-authority"], internal: ["lib/utils"], peer: ["react", "react-native", "nativewind"] },
	examples: [{ title: "Basic", description: "A button", code: "<Button onPress={save}><Text>Save</Text></Button>" }],
	ai: {
		commonMistakes: ["Passing a bare string child — wrap labels in <Text>"],
		relatedComponents: ["native-text", "native-badge"],
		accessibilityNotes: "Renders a Pressable with role=\"button\"; pass aria-label on icon-only buttons so VoiceOver has a name.",
	},
};

describe("toNativeSlug / isNativeSlug", () => {
	it("prefixes a web slug once", () => {
		expect(toNativeSlug("button")).toBe("native-button");
		expect(toNativeSlug("native-button")).toBe("native-button");
	});

	it("recognises the prefix", () => {
		expect(isNativeSlug("native-button")).toBe(true);
		expect(isNativeSlug("button")).toBe(false);
	});
});

describe("deriveNativeSchema", () => {
	const native = deriveNativeSchema(webButton, overrides);

	it("names the item with the native prefix and sets the platform facet", () => {
		expect(native.name).toBe("native-button");
		expect(native.platform).toBe("native");
		expect(native.displayName).toBe("Button");
	});

	it("validates against componentSchemaDefinition", () => {
		expect(componentSchemaDefinition.safeParse(native).success).toBe(true);
	});

	it("removes and adds props, keeping the rest in web order", () => {
		expect(native.props.map((p) => p.name)).toEqual(["variant", "disabled", "onPress"]);
	});

	it("inherits neutral fields", () => {
		expect(native.description).toBe(webButton.description);
		expect(native.category).toBe("primitive");
		expect(native.subcategory).toBe("actions");
		expect(native.variants).toEqual(webButton.variants);
		expect(native.slots).toEqual(webButton.slots);
		expect(native.tokensUsed).toEqual(webButton.tokensUsed);
		expect(native.ai.whenToUse).toBe(webButton.ai.whenToUse);
		expect(native.ai.whenNotToUse).toBe(webButton.ai.whenNotToUse);
	});

	it("takes the mandatory overrides verbatim", () => {
		expect(native.dependencies).toEqual(overrides.dependencies);
		expect(native.examples).toEqual(overrides.examples);
		expect(native.ai.commonMistakes).toEqual(overrides.ai.commonMistakes);
		expect(native.ai.relatedComponents).toEqual(overrides.ai.relatedComponents);
		expect(native.ai.accessibilityNotes).toBe(overrides.ai.accessibilityNotes);
	});

	it("does not inherit the web tokenBudget", () => {
		expect(native.ai.tokenBudget).toBeUndefined();
	});

	it("prefixes inherited antiPattern targets to their native counterparts", () => {
		expect(native.ai.antiPatterns).toEqual([
			{ mistake: "Using a button to toggle state", insteadUse: "native-switch", why: "Switch carries the on/off semantic." },
		]);
	});

	it("appends native tags without duplicating", () => {
		expect(native.tags).toEqual(["button", "action", "native", "react-native"]);
		const tagged = deriveNativeSchema({ ...webButton, tags: ["native"] }, overrides);
		expect(tagged.tags).toEqual(["native", "react-native"]);
	});

	it("lets every optional override replace its inherited field", () => {
		const custom = deriveNativeSchema(webButton, {
			...overrides,
			description: "A pressable action for touch surfaces.",
			variants: [],
			slots: [],
			tags: ["press"],
			ai: {
				...overrides.ai,
				whenToUse: "Use for the single primary action on a native screen, wired to onPress.",
				whenNotToUse: "Don't use for navigation between screens; use the router's Link component instead.",
				antiPatterns: [],
			},
		});
		expect(custom.description).toBe("A pressable action for touch surfaces.");
		expect(custom.variants).toEqual([]);
		expect(custom.slots).toEqual([]);
		expect(custom.tags).toEqual(["press"]);
		expect(custom.ai.whenToUse).toContain("onPress");
		expect(custom.ai.antiPatterns).toEqual([]);
	});

	// `tokensUsed` is measured from the native source by the registry build,
	// exactly like `tokenBudget`. It is deliberately absent from the override
	// type: two schemas once declared one and the build discarded it silently.
	it("does not accept a tokensUsed override", () => {
		// @ts-expect-error tokensUsed is derived by the build, never declared here.
		const withDeclared = deriveNativeSchema(webButton, { ...overrides, tokensUsed: ["primary"] });
		// The web list is carried through only to satisfy the schema; the
		// registry build replaces it with what the native source actually paints.
		expect(withDeclared.tokensUsed).toEqual(webButton.tokensUsed);
	});

	it("rejects removing a prop the web schema does not have", () => {
		expect(() => deriveNativeSchema(webButton, { ...overrides, removeProps: ["href"] })).toThrow(/no prop "href"/);
	});

	it("rejects adding a prop that collides with a kept web prop", () => {
		expect(() =>
			deriveNativeSchema(webButton, {
				...overrides,
				addProps: [{ name: "disabled", type: "boolean", required: false, description: "dup" }],
			}),
		).toThrow(/already has a prop "disabled"/);
	});

	it("rejects deriving from a schema that is already native", () => {
		expect(() => deriveNativeSchema(native, overrides)).toThrow(/already a native schema/);
	});

	it("does not mutate the web schema", () => {
		expect(webButton.name).toBe("button");
		expect(webButton.props?.map((p) => p.name)).toEqual(["variant", "asChild", "disabled"]);
		expect(webButton.ai.antiPatterns?.[0]?.insteadUse).toBe("switch");
	});
});
