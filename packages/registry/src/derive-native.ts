/**
 * Derive a React Native schema from a web one.
 *
 * Most of a component's `ai` block is platform-neutral — when to reach for a
 * Button, when not to, what it relates to — and duplicating it across a
 * `packages/native` copy is the drift the schema-quality gate exists to
 * prevent. So a native schema is the web schema plus an explicit diff: the
 * props that go away (`asChild`, `onClick`), the props that appear
 * (`onPress`), and the prose that must be rewritten because the platform's
 * accessibility model and failure modes differ.
 *
 * `accessibilityNotes`, `commonMistakes`, `relatedComponents`, `examples`
 * and `dependencies` are **required** overrides, never inherited: each one
 * is where DOM assumptions hide (`aria-label` on a `<button>`, a `hover:`
 * example, a Radix dependency). Everything else inherits unless overridden.
 */
import {
	componentSchemaDefinition,
	type ComponentSchemaDefinition,
	type ComponentSchemaInput,
} from "./schema.js";

/** The prefix every native registry item's `name` carries. */
export const NATIVE_SLUG_PREFIX = "native-";

type PropInput = NonNullable<ComponentSchemaInput["props"]>[number];
type VariantInput = NonNullable<ComponentSchemaInput["variants"]>[number];
type SlotInput = NonNullable<ComponentSchemaInput["slots"]>[number];
type DependencyInput = NonNullable<ComponentSchemaInput["dependencies"]>;
type UsageExampleInput = NonNullable<ComponentSchemaInput["examples"]>[number];
type AntiPatternInput = NonNullable<ComponentSchemaInput["ai"]["antiPatterns"]>[number];

/**
 * The diff between a web schema and its native counterpart.
 *
 * Required fields are the ones that always change when the renderer
 * changes. Optional fields inherit from the web schema when omitted.
 */
export interface NativeSchemaOverrides {
	/** Replaces the web description; inherits when omitted. */
	description?: string;
	/** Web prop names that do not exist on native (`asChild`, `onClick`). Each must exist on the web schema. */
	removeProps?: readonly string[];
	/** Props that only exist on native (`onPress`). Must not collide with a kept web prop. */
	addProps?: readonly PropInput[];
	/** Replaces the web variants wholesale; inherits when omitted. */
	variants?: readonly VariantInput[];
	/** Replaces the web slots wholesale; inherits when omitted. */
	slots?: readonly SlotInput[];
	/** Always declared: native never shares the web dependency graph. */
	dependencies: DependencyInput;
	/** Replaces the web token list; inherits when omitted. */
	tokensUsed?: readonly string[];
	/** Always declared: web examples carry `asChild`, `href` and DOM elements. */
	examples: readonly UsageExampleInput[];
	/** Replaces the derived tags (web tags + `native` + `react-native`). */
	tags?: readonly string[];
	/** The `ai` block diff. */
	ai: {
		/** Inherits when omitted. */
		whenToUse?: string;
		/** Inherits when omitted. */
		whenNotToUse?: string;
		/** Always rewritten: web mistakes are about `asChild`, `aria-*` and `onClick`. */
		commonMistakes: readonly string[];
		/**
		 * Replaces the web anti-patterns. When omitted, the web entries are kept
		 * with each `insteadUse` slug prefixed to its native counterpart; the
		 * schema-quality gate fails the item if that counterpart does not exist.
		 */
		antiPatterns?: readonly AntiPatternInput[];
		/** Always declared: the native catalog is smaller, so web relations rarely all exist. */
		relatedComponents: readonly string[];
		/** Always rewritten: RN uses `role`/`aria-*` alias props and no focus ring. */
		accessibilityNotes: string;
	};
}

/**
 * Map a web slug to its native item name.
 * @param slug - A web item slug such as `button`
 * @returns The native slug, `native-button`; already-prefixed slugs pass through
 */
export function toNativeSlug(slug: string): string {
	return slug.startsWith(NATIVE_SLUG_PREFIX) ? slug : `${NATIVE_SLUG_PREFIX}${slug}`;
}

/**
 * True when a registry item name belongs to the native catalog.
 * @param name - Any registry item name
 * @returns Whether the name carries the native prefix
 */
export function isNativeSlug(name: string): boolean {
	return name.startsWith(NATIVE_SLUG_PREFIX);
}

/**
 * Remove duplicate strings, keeping first occurrence order.
 * @param values - Strings that may repeat
 * @returns The same strings with later duplicates dropped
 */
function dedupe(values: readonly string[]): string[] {
	return [...new Set(values)];
}

/**
 * Build a self-contained native schema from a web schema and an explicit
 * override diff.
 *
 * The result is fully materialised — the emitted registry JSON carries no
 * reference back to the web item — and is validated through
 * `componentSchemaDefinition`, so an override that produces an invalid
 * schema fails here, at authoring time, not in the registry build.
 * @param web - The web component's schema, as exported from `@hex-core/components/schemas`
 * @param overrides - What differs on native
 * @returns The native schema, named `native-<web.name>` with `platform: "native"`
 * @throws {Error} When `web` is already native, when `removeProps` names a prop the web schema lacks,
 *   or when `addProps` collides with a kept web prop
 * @example
 * ```ts
 * export const nativeButtonSchema = deriveNativeSchema(buttonSchema, {
 *   removeProps: ["asChild"],
 *   addProps: [{ name: "onPress", type: "function", required: false, description: "Press handler" }],
 *   dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["lib/utils"], peer: ["react", "react-native", "nativewind"] },
 *   examples: [{ title: "Basic", description: "A primary button", code: "<Button onPress={save}><Text>Save</Text></Button>" }],
 *   ai: {
 *     commonMistakes: ["Passing a bare string child — wrap labels in <Text>"],
 *     relatedComponents: ["native-text", "native-badge"],
 *     accessibilityNotes: "Renders a Pressable with role=\"button\"; pass aria-label on icon-only buttons.",
 *   },
 * });
 * ```
 */
export function deriveNativeSchema(
	web: ComponentSchemaInput,
	overrides: NativeSchemaOverrides,
): ComponentSchemaDefinition {
	if (web.platform === "native") {
		throw new Error(`deriveNativeSchema: "${web.name}" is already a native schema`);
	}

	const webProps = web.props ?? [];
	const removeProps = overrides.removeProps ?? [];
	for (const name of removeProps) {
		if (!webProps.some((p) => p.name === name)) {
			throw new Error(`deriveNativeSchema: "${web.name}" has no prop "${name}" to remove`);
		}
	}
	const keptProps = webProps.filter((p) => !removeProps.includes(p.name));
	const addProps = overrides.addProps ?? [];
	for (const added of addProps) {
		if (keptProps.some((p) => p.name === added.name)) {
			throw new Error(
				`deriveNativeSchema: "${web.name}" already has a prop "${added.name}" — list it in removeProps to replace it`,
			);
		}
	}

	const antiPatterns =
		overrides.ai.antiPatterns !== undefined
			? [...overrides.ai.antiPatterns]
			: web.ai.antiPatterns?.map((a) => ({ ...a, insteadUse: toNativeSlug(a.insteadUse) }));

	const candidate: ComponentSchemaInput = {
		name: toNativeSlug(web.name),
		platform: "native",
		displayName: web.displayName,
		description: overrides.description ?? web.description,
		category: web.category,
		subcategory: web.subcategory,
		props: [...keptProps, ...addProps],
		variants: overrides.variants !== undefined ? [...overrides.variants] : web.variants,
		slots: overrides.slots !== undefined ? [...overrides.slots] : web.slots,
		dependencies: overrides.dependencies,
		tokensUsed: overrides.tokensUsed !== undefined ? [...overrides.tokensUsed] : web.tokensUsed,
		examples: [...overrides.examples],
		ai: {
			whenToUse: overrides.ai.whenToUse ?? web.ai.whenToUse,
			whenNotToUse: overrides.ai.whenNotToUse ?? web.ai.whenNotToUse,
			commonMistakes: [...overrides.ai.commonMistakes],
			...(antiPatterns !== undefined ? { antiPatterns } : {}),
			relatedComponents: [...overrides.ai.relatedComponents],
			accessibilityNotes: overrides.ai.accessibilityNotes,
			// tokenBudget is deliberately not inherited: the registry build
			// measures it from the native source.
		},
		tags:
			overrides.tags !== undefined
				? [...overrides.tags]
				: dedupe([...(web.tags ?? []), "native", "react-native"]),
	};

	return componentSchemaDefinition.parse(candidate);
}
