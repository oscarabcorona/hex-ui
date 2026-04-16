import registryIndex from "../../../../registry/registry.json";

export interface RegistryIndexItem {
	name: string;
	displayName: string;
	description: string;
	category: string;
	subcategory?: string;
	tags: string[];
	internalDeps: string[];
	tokenBudget?: number;
}

export interface PropDef {
	name: string;
	type: string;
	required: boolean;
	default?: unknown;
	description: string;
	enumValues?: string[];
}

export interface VariantDef {
	name: string;
	description: string;
	values: { value: string; description: string }[];
	default: string;
}

export interface AIHints {
	whenToUse: string;
	whenNotToUse: string;
	commonMistakes: string[];
	relatedComponents: string[];
	accessibilityNotes: string;
	tokenBudget: number;
}

export interface Example {
	title: string;
	description: string;
	code: string;
}

export interface RegistryItem {
	name: string;
	displayName: string;
	description: string;
	category: string;
	subcategory?: string;
	version?: string;
	framework?: string;
	props: PropDef[];
	variants: VariantDef[];
	examples: Example[];
	ai: AIHints;
	dependencies: { npm: string[]; internal: string[]; peer: string[] };
	tags: string[];
}

interface RegistryIndex {
	items: RegistryIndexItem[];
}

const index = registryIndex as RegistryIndex;

/** All component summaries from the registry index. */
export function listComponents(): RegistryIndexItem[] {
	return index.items;
}

/**
 * Group components by `category` (primitive, component, block, etc.).
 * @returns Record of category → components list
 */
export function componentsByCategory(): Record<string, RegistryIndexItem[]> {
	const groups: Record<string, RegistryIndexItem[]> = {};
	for (const item of index.items) {
		const key = item.category;
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
	}
	return groups;
}

/**
 * Derive the install command for a component.
 * @param slug - Component name
 * @returns The pnpm dlx install command
 */
export function installCommand(slug: string): string {
	return `pnpm dlx @hex-ui/cli add ${slug}`;
}

/** Label for the install command's package manager (e.g. shown as a code-block header). */
export const INSTALL_COMMAND_LABEL = "pnpm";

/**
 * Derive a usage code snippet from a registry item.
 * @param item - Full registry item
 * @returns A minimal import + usage example
 */
export function usageCode(item: RegistryItem): string {
	if (item.examples.length > 0) {
		return item.examples[0].code;
	}
	return `import { ${item.displayName} } from "@/components/ui/${item.name}"`;
}

/**
 * Convert a heading title into a URL-safe anchor slug.
 * @param title - The section title
 * @returns A lowercase, hyphen-separated slug
 */
export function slugify(title: string): string {
	return title.toLowerCase().replace(/\s+/g, "-");
}
