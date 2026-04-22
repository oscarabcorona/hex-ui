import { loadRegistry, loadRegistryItem, type RegistryIndex } from "./registry-loader.js";
import { loadRecipes, type RecipeIndex } from "./recipe-loader.js";

/**
 * Cap on the number of recipe matches returned by `resolveSpec`. Recipes
 * are a smaller, more opinionated surface than components so we surface
 * fewer of them — the agent should nearly always pick one.
 */
const MAX_RECIPE_MATCHES = 4;

type RegistryIndexItemLike = Pick<
	RegistryIndex["items"][number],
	"name" | "displayName" | "description" | "tags" | "tokenBudget"
>;

export interface ComponentMatch {
	component: string;
	displayName: string;
	score: number;
	matchReason: string[];
	whenToUse: string;
	whenNotToUse: string;
	relatedComponents: string[];
	tokenBudget?: number;
}

export interface RecipeMatch {
	slug: string;
	title: string;
	summary: string;
	score: number;
	matchReason: string[];
}

export interface ResolveResult {
	brief: string;
	components: ComponentMatch[];
	recipes: RecipeMatch[];
}

/**
 * Tokenize a freeform brief into lowercase word stems. The only
 * transformation is case-folding and splitting on non-alphanumerics; any
 * stopword-style filtering stays out of scope so a brief like "form for
 * pricing" still produces "form" + "pricing" rather than silently dropping
 * "for" via a list that would drift over time.
 * @param input - Freeform text to tokenize
 * @returns Deduped lowercase tokens of length >= 3
 */
function tokenize(input: string): string[] {
	const tokens = input
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length >= 3);
	return Array.from(new Set(tokens));
}

interface ComponentAiMeta {
	whenToUse: string;
	whenNotToUse: string;
	relatedComponents: string[];
}

/**
 * Build a component's AI meta by reading the full registry item. The full
 * item already lives on disk and is small (tens of KB) so reading once per
 * resolve call is cheap and keeps the resolver independent of any cache.
 * @param name - Component slug to look up
 * @returns AI meta, or empty strings / empty arrays when the item is missing
 */
function getComponentAi(name: string): ComponentAiMeta {
	const item = loadRegistryItem(name);
	const fallback: ComponentAiMeta = {
		whenToUse: "",
		whenNotToUse: "",
		relatedComponents: [],
	};
	if (!item) return fallback;

	const ai = item.ai;
	return {
		whenToUse: typeof ai?.whenToUse === "string" ? ai.whenToUse : "",
		whenNotToUse: typeof ai?.whenNotToUse === "string" ? ai.whenNotToUse : "",
		relatedComponents: Array.isArray(ai?.relatedComponents)
			? ai.relatedComponents.filter((c): c is string => typeof c === "string")
			: [],
	};
}

/**
 * Score a single registry index item against the brief's tokens.
 * Weighting favors structural signals (name, tags) over prose (description)
 * because an agent's brief almost always contains the component's tag
 * vocabulary ("form", "dialog") before it contains prose phrasing. Each
 * token contributes at most one match reason (the highest-weight hit),
 * so a component with "form" in name + tags + description still scores +10
 * for that token, not +14.
 * @param item - Registry index entry to score
 * @param tokens - Brief tokens produced by `tokenize`
 * @returns Aggregate score and a list of per-token match reasons
 */
function scoreComponent(item: RegistryIndexItemLike, tokens: string[]): {
	score: number;
	reasons: string[];
} {
	const reasons: string[] = [];
	let score = 0;

	const name = item.name.toLowerCase();
	const display = item.displayName.toLowerCase();
	const description = item.description.toLowerCase();
	const tagSet = new Set(item.tags.map((t) => t.toLowerCase()));

	for (const token of tokens) {
		if (name === token) {
			score += 10;
			reasons.push(`name === "${token}"`);
			continue;
		}
		if (name.includes(token)) {
			score += 6;
			reasons.push(`name contains "${token}"`);
			continue;
		}
		if (tagSet.has(token)) {
			score += 5;
			reasons.push(`tag matches "${token}"`);
			continue;
		}
		if (display.includes(token)) {
			score += 3;
			reasons.push(`displayName contains "${token}"`);
			continue;
		}
		if (description.includes(token)) {
			score += 1;
			reasons.push(`description mentions "${token}"`);
		}
	}

	return { score, reasons };
}

/**
 * Score a recipe index entry against the brief's tokens. Recipe matches
 * use the same tokenization but weight slug + title + tags higher than
 * summary, and include a bonus when the recipe's authored `brief`
 * contains the same tokens (the `brief` acts as a regression test fixture
 * paired with the recipe).
 * @param recipe - Recipe index entry to score
 * @param tokens - Brief tokens produced by `tokenize`
 * @returns Aggregate score and a list of per-token match reasons
 */
function scoreRecipe(
	recipe: RecipeIndex["items"][number] & { brief?: string },
	tokens: string[],
): {
	score: number;
	reasons: string[];
} {
	const reasons: string[] = [];
	let score = 0;

	const slug = recipe.slug.toLowerCase();
	const title = recipe.title.toLowerCase();
	const summary = recipe.summary.toLowerCase();
	const tagSet = new Set(recipe.tags.map((t) => t.toLowerCase()));

	for (const token of tokens) {
		if (slug.includes(token)) {
			score += 8;
			reasons.push(`recipe slug contains "${token}"`);
			continue;
		}
		if (tagSet.has(token)) {
			score += 6;
			reasons.push(`recipe tag matches "${token}"`);
			continue;
		}
		if (title.includes(token)) {
			score += 4;
			reasons.push(`recipe title contains "${token}"`);
			continue;
		}
		if (summary.includes(token)) {
			score += 2;
			reasons.push(`recipe summary mentions "${token}"`);
		}
	}

	return { score, reasons };
}

export interface ResolverOptions {
	limit?: number;
	registry?: RegistryIndex;
	recipes?: RecipeIndex;
}

/**
 * Resolve a plain-English brief into a ranked shortlist of components and
 * recipes. Deterministic: same input + same registry snapshot always
 * produces the same output, so agents can cite a specific slug with
 * confidence and CI can regression-test the resolver against fixed
 * briefs.
 * @param brief - Freeform description of the UI the agent wants to build
 * @param options - Optional overrides for the registry / recipe snapshots and result limit
 * @returns A ranked result containing component and recipe matches
 */
export function resolveSpec(brief: string, options: ResolverOptions = {}): ResolveResult {
	const tokens = tokenize(brief);
	if (tokens.length === 0) {
		return { brief, components: [], recipes: [] };
	}

	const registry = options.registry ?? loadRegistry();
	const recipes = options.recipes ?? loadRecipes();
	const limit = options.limit ?? 8;

	const componentScored: ComponentMatch[] = [];
	for (const item of registry.items) {
		const { score, reasons } = scoreComponent(item, tokens);
		if (score <= 0) continue;

		const ai = getComponentAi(item.name);
		componentScored.push({
			component: item.name,
			displayName: item.displayName,
			score,
			matchReason: reasons,
			whenToUse: ai.whenToUse,
			whenNotToUse: ai.whenNotToUse,
			relatedComponents: ai.relatedComponents,
			tokenBudget: item.tokenBudget,
		});
	}
	componentScored.sort((a, b) => b.score - a.score || a.component.localeCompare(b.component));

	const recipeScored: RecipeMatch[] = [];
	for (const recipe of recipes.items) {
		const { score, reasons } = scoreRecipe(recipe, tokens);
		if (score <= 0) continue;
		recipeScored.push({
			slug: recipe.slug,
			title: recipe.title,
			summary: recipe.summary,
			score,
			matchReason: reasons,
		});
	}
	recipeScored.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

	return {
		brief,
		components: componentScored.slice(0, limit),
		recipes: recipeScored.slice(0, Math.min(limit, MAX_RECIPE_MATCHES)),
	};
}
