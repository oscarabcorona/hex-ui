import { z } from "zod";

// ─── Prop Schema (machine-readable component interface) ───

export const propSchema = z.object({
	name: z.string(),
	type: z.enum(["string", "number", "boolean", "enum", "ReactNode", "function", "object"]),
	required: z.boolean().default(false),
	default: z.unknown().optional(),
	description: z.string(),
	enumValues: z.array(z.string()).optional(),
	constraints: z
		.object({
			minLength: z.number().optional(),
			maxLength: z.number().optional(),
			min: z.number().optional(),
			max: z.number().optional(),
			pattern: z.string().optional(),
		})
		.optional(),
});

export type Prop = z.infer<typeof propSchema>;

// ─── Variant Schema ───

export const variantValueSchema = z.object({
	value: z.string(),
	description: z.string(),
});

export const variantSchema = z.object({
	name: z.string(),
	description: z.string(),
	values: z.array(variantValueSchema),
	default: z.string(),
});

export type Variant = z.infer<typeof variantSchema>;

// ─── Slot Schema (composition points) ───

export const slotSchema = z.object({
	name: z.string(),
	description: z.string(),
	required: z.boolean().default(false),
	acceptedTypes: z.array(z.string()).optional(),
});

export type Slot = z.infer<typeof slotSchema>;

// ─── File Schema ───

export const fileSchema = z.object({
	path: z.string(),
	content: z.string(),
	type: z.enum(["component", "lib", "hook", "style", "config", "test"]),
});

export type RegistryFile = z.infer<typeof fileSchema>;

// ─── Dependency Schema ───

export const dependencySchema = z.object({
	npm: z.array(z.string()).default([]),
	internal: z.array(z.string()).default([]),
	peer: z.array(z.string()).default([]),
});

export type Dependencies = z.infer<typeof dependencySchema>;

// ─── Usage Example Schema ───

export const usageExampleSchema = z.object({
	title: z.string(),
	description: z.string(),
	code: z.string(),
});

export type UsageExample = z.infer<typeof usageExampleSchema>;

// ─── AI Hint Schema ───

export const aiHintSchema = z.object({
	whenToUse: z.string(),
	whenNotToUse: z.string(),
	commonMistakes: z.array(z.string()),
	relatedComponents: z.array(z.string()),
	accessibilityNotes: z.string(),
	tokenBudget: z.number().optional(),
});

export type AIHint = z.infer<typeof aiHintSchema>;

// ─── Category Enum ───

export const categoryEnum = z.enum([
	"primitive",
	"component",
	"block",
	"example",
	"theme",
	"hook",
	"lib",
]);

export type Category = z.infer<typeof categoryEnum>;

// ─── Registry Item (the core schema) ───

export const registryItemSchema = z.object({
	$schema: z.string().default("https://hex-core.dev/schema/registry-item.json"),
	name: z.string().regex(/^[a-z][a-z0-9-]*$/),
	displayName: z.string(),
	description: z.string(),
	category: categoryEnum,
	subcategory: z.string().optional(),
	version: z.string().default("0.1.0"),
	framework: z.enum(["react", "vue", "svelte"]).default("react"),

	// Machine-readable component spec
	props: z.array(propSchema).default([]),
	variants: z.array(variantSchema).default([]),
	slots: z.array(slotSchema).default([]),

	// Files to install
	files: z.array(fileSchema),

	// Dependencies
	dependencies: dependencySchema,

	// Design tokens used
	tokensUsed: z.array(z.string()).default([]),

	// CSS variables introduced
	cssVariables: z
		.record(
			z.string(),
			z.object({
				light: z.string(),
				dark: z.string(),
			}),
		)
		.optional(),

	// Usage examples
	examples: z.array(usageExampleSchema).default([]),

	// AI-specific metadata
	ai: aiHintSchema,

	// Search tags
	tags: z.array(z.string()).default([]),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;

// ─── Registry Index (lightweight catalog) ───

export const registryIndexItemSchema = z.object({
	name: z.string(),
	displayName: z.string(),
	description: z.string(),
	category: categoryEnum,
	subcategory: z.string().optional(),
	tags: z.array(z.string()),
	internalDeps: z.array(z.string()).default([]),
	tokenBudget: z.number().optional(),
});

export type RegistryIndexItem = z.infer<typeof registryIndexItemSchema>;

export const registryIndexSchema = z.object({
	$schema: z.string().default("https://hex-core.dev/schema/registry.json"),
	name: z.string(),
	version: z.string(),
	description: z.string(),
	homepage: z.string(),
	items: z.array(registryIndexItemSchema),
});

export type RegistryIndex = z.infer<typeof registryIndexSchema>;

// ─── Token Schemas ───

export const tokenTypeEnum = z.enum([
	"color",
	"dimension",
	"font",
	"fontWeight",
	"duration",
	"cubicBezier",
	"number",
	"shadow",
	"gradient",
	"radius",
	"spacing",
	"opacity",
]);

export const tokenValueSchema = z.object({
	value: z.string(),
	description: z.string().optional(),
	type: tokenTypeEnum,
});

export type TokenValue = z.infer<typeof tokenValueSchema>;

export const tokenGroupSchema: z.ZodType<Record<string, TokenValue | Record<string, unknown>>> =
	z.lazy(() => z.record(z.string(), z.union([tokenValueSchema, z.record(z.string(), z.unknown())])));

export const themeSchema = z.object({
	name: z.string(),
	displayName: z.string(),
	description: z.string(),
	tokens: z.object({
		light: z.record(z.string(), z.unknown()),
		dark: z.record(z.string(), z.unknown()),
	}),
});

export type Theme = z.infer<typeof themeSchema>;

// ─── Component Schema Definition (used in .schema.ts files) ───

export const componentSchemaDefinition = z.object({
	name: z.string(),
	displayName: z.string(),
	description: z.string(),
	category: categoryEnum,
	subcategory: z.string().optional(),
	props: z.array(propSchema),
	variants: z.array(variantSchema),
	slots: z.array(slotSchema),
	dependencies: dependencySchema,
	tokensUsed: z.array(z.string()),
	examples: z.array(usageExampleSchema),
	ai: aiHintSchema,
	tags: z.array(z.string()),
});

export type ComponentSchemaDefinition = z.infer<typeof componentSchemaDefinition>;
