import * as fs from "node:fs";
import * as path from "node:path";
import { SLUG_REGEX } from "@hex-core/registry";
import { printSkillsHint } from "../lib/post-install.js";
import { findRegistryDir } from "../lib/registry-dir.js";
import { resolvePlatform } from "../lib/resolve-platform.js";
import { addComponents } from "./add.js";

type RecipeKind = "component" | "page";
type PageType = "landing" | "app" | "ecommerce";

interface RecipeIndexItem {
	slug: string;
	kind?: RecipeKind;
	pageType?: PageType;
	title: string;
	summary: string;
	components: string[];
}

interface RecipeStep {
	component: string;
	reason: string;
	role: "primary" | "supporting" | "optional";
}

interface PageSection {
	id: string;
	block: string;
	intent: string;
	role: "primary" | "supporting" | "optional";
}

interface PageTheme {
	preset: string;
	tokenBudget?: number;
}

interface RecipeChecklistItem {
	id: string;
	check: string;
	severity: "blocker" | "warn" | "nit";
	source: "author" | "derived-mistake" | "derived-a11y";
}

interface Recipe {
	slug: string;
	kind?: RecipeKind;
	title: string;
	summary: string;
	brief: string;
	steps: RecipeStep[];
	pageType?: PageType;
	theme?: PageTheme;
	sections?: PageSection[];
	layout?: string;
	checklist: RecipeChecklistItem[];
	tokenBudget?: number;
	/** Render target; absent for web recipes. Derived by the registry build. */
	platform?: "web" | "native";
}

/**
 * Print all available recipes grouped by title.
 */
export async function listRecipes(): Promise<void> {
	const registryDir = findRegistryDir();
	if (!registryDir) {
		console.error("Could not find registry. Run from the hex-core project root.");
		process.exit(1);
	}

	const indexPath = path.join(registryDir, "recipes.json");
	if (!fs.existsSync(indexPath)) {
		console.log("\nNo recipes available.\n");
		return;
	}

	const index: { items: RecipeIndexItem[] } = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

	console.log("\nHex Core Recipes\n");
	for (const recipe of index.items) {
		// Tag page recipes with their archetype so `hex recipe list` makes the
		// "landing/app/store" entry points obvious next to the component bundles.
		const kindLabel = recipe.kind === "page" ? ` [page: ${recipe.pageType ?? "page"}]` : "";
		console.log(`  ${recipe.slug.padEnd(22)} ${recipe.title}${kindLabel}`);
		console.log(`  ${" ".repeat(22)} ${recipe.summary}`);
		const memberLabel = recipe.kind === "page" ? "Sections" : "Components";
		console.log(`  ${" ".repeat(22)} ${memberLabel}: ${recipe.components.join(", ")}`);
		console.log();
	}
	console.log(`Total: ${index.items.length} recipes`);
}

/**
 * Install every component in the recipe's step list (in order), then print
 * the recipe's checklist so the agent or developer can walk it. Reuses the
 * existing `addComponents` implementation so the CLI has one file-writing
 * code path.
 * @param slug - Recipe slug (e.g. `auth-form`)
 * @param options - Flags forwarded to `addComponents`
 * @param options.yes - Skip confirmation prompts
 * @param options.overwrite - Overwrite existing files instead of skipping
 */
export async function addRecipe(
	slug: string,
	options: { yes: boolean; overwrite: boolean },
): Promise<void> {
	if (!SLUG_REGEX.test(slug)) {
		console.error(`Invalid recipe slug: "${slug}"`);
		process.exit(1);
	}

	const registryDir = findRegistryDir();
	if (!registryDir) {
		console.error("Could not find registry. Run from the hex-core project root.");
		process.exit(1);
	}

	const recipePath = path.join(registryDir, "recipes", `${slug}.json`);
	if (!fs.existsSync(recipePath)) {
		console.error(`Recipe "${slug}" not found. Run "hex recipe list" to see available recipes.`);
		process.exit(1);
	}

	const recipe: Recipe = JSON.parse(fs.readFileSync(recipePath, "utf-8"));
	const isPage = recipe.kind === "page";

	// A recipe is a blueprint for one renderer. `addComponents` resolves the
	// platform from the project, so installing a web recipe into an Expo app
	// used to rewrite the components that HAVE native ports, refuse the ones
	// that do not, and then print a checklist written for the DOM — a
	// half-installed recipe with instructions for the wrong platform.
	const projectPlatform = resolvePlatform(process.cwd()).platform;
	const recipePlatform = recipe.platform ?? "web";
	if (recipePlatform !== projectPlatform) {
		console.error(
			`Recipe "${slug}" targets ${recipePlatform === "native" ? "React Native" : "the web"}; this project is ${projectPlatform === "native" ? "React Native" : "web"}.`,
		);
		const sibling = recipePlatform === "web" ? `${slug}-native` : slug.replace(/-native$/, "");
		if (fs.existsSync(path.join(registryDir, "recipes", `${sibling}.json`))) {
			console.error(`  Use \`hex recipe add ${sibling}\` instead.`);
		} else {
			console.error(`  Run \`hex list --platform ${projectPlatform}\` to see the recipes that apply.`);
		}
		process.exit(1);
	}

	console.log(`\nAdding recipe: ${recipe.title}`);
	console.log(`  ${recipe.summary}\n`);

	// Page recipes recommend a token preset they were designed against. We
	// surface it rather than rewriting globals.css mid-install — applying a
	// theme is `hex init --theme` / `hex theme`, and clobbering the consumer's
	// tokens here would be destructive and surprising.
	if (isPage && recipe.theme) {
		console.log(`Recommended theme: ${recipe.theme.preset}`);
		console.log(`  Apply with: hex theme use ${recipe.theme.preset}\n`);
	}
	if (isPage && recipe.layout) {
		console.log(`Layout: ${recipe.layout}\n`);
	}

	// Install targets: ordered section blocks for a page recipe, flat step
	// components otherwise. Both pass deps: true so transitive internal deps
	// (e.g. combobox → command + popover) install too.
	const slugs = isPage
		? (recipe.sections ?? []).map((s) => s.block)
		: recipe.steps.map((s) => s.component);
	await addComponents(slugs, { ...options, deps: true, install: true });

	if (recipe.checklist.length > 0) {
		console.log("\nPost-install checklist:");
		for (const item of recipe.checklist) {
			const prefix = item.severity === "blocker" ? "!" : "-";
			console.log(`  ${prefix} ${item.check}`);
		}
	}
	printSkillsHint(process.cwd());
	console.log();
}
