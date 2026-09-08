import * as fs from "node:fs";
import * as path from "node:path";
import { findRegistryDir, findRegistryIndex } from "../lib/registry-dir.js";

interface RecipeSummary {
	slug: string;
	title: string;
	summary: string;
	/** Render target; absent for web recipes. Derived by the registry build. */
	platform?: "web" | "native";
}

/** One row of the registry index, as far as this command reads it. */
interface IndexRow {
	name: string;
	description: string;
	category: string;
	/** Absent for web items — the emitted default. */
	platform?: "web" | "native";
}

/** Options for {@link listComponents}. */
export interface ListOptions {
	/** Restrict the listing to one render target. Omit to list everything. */
	platform?: "web" | "native";
}

/**
 * Print all available components grouped by category, then a recipes
 * section so users discover spec-driven blueprints (auth-form,
 * settings-page, ...) without hunting for a separate `hex recipe list`.
 *
 * The catalog holds two render targets, so `--platform` narrows it. Native
 * items are named `native-<slug>`; a web project cannot use them and a
 * React Native project cannot use the web ones.
 * @param options - {@link ListOptions}
 */
export async function listComponents(options: ListOptions = {}) {
	const indexPath = findRegistryIndex();
	if (!indexPath) {
		console.error("Could not find registry. Run from the hex-core project root.");
		process.exit(1);
	}

	const registry = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
	const allItems: IndexRow[] = registry.items;
	const items = options.platform
		? allItems.filter((item) => (item.platform ?? "web") === options.platform)
		: allItems;

	const heading = options.platform === "native" ? "Hex Core Components (React Native)" : "Hex Core Components";
	console.log(`\n${heading}\n`);

	const grouped: Record<string, Array<{ name: string; description: string }>> = {};
	for (const item of items) {
		const cat = item.category;
		if (!grouped[cat]) grouped[cat] = [];
		grouped[cat].push({ name: item.name, description: item.description });
	}

	for (const [category, items] of Object.entries(grouped)) {
		console.log(`  ${category.toUpperCase()}`);
		for (const item of items) {
			console.log(`    ${item.name.padEnd(20)} ${item.description}`);
		}
		console.log();
	}

	console.log(`Total: ${items.length} components`);

	// The recipes were printed unfiltered under a heading that already said
	// "(React Native)", so `hex list --platform native` offered 26 web
	// blueprints of which exactly one applies.
	const allRecipes = loadRecipes();
	const recipes = options.platform
		? allRecipes.filter((r) => (r.platform ?? "web") === options.platform)
		: allRecipes;
	if (recipes.length > 0) {
		console.log("\nRecipes (spec-driven blueprints)\n");
		for (const r of recipes) {
			console.log(`    ${r.slug.padEnd(20)} ${r.summary || r.title}`);
		}
		console.log(`\n    Try one: hex recipe add ${recipes[0].slug}`);
	}
}

function loadRecipes(): RecipeSummary[] {
	const dir = findRegistryDir();
	if (!dir) return [];
	const recipesDir = path.join(dir, "recipes");
	if (!fs.existsSync(recipesDir)) return [];
	const files = fs.readdirSync(recipesDir).filter((f) => f.endsWith(".json"));
	const out: RecipeSummary[] = [];
	for (const f of files) {
		try {
			const raw = JSON.parse(fs.readFileSync(path.join(recipesDir, f), "utf-8"));
			out.push({
				slug: String(raw.slug ?? f.replace(/\.json$/, "")),
				title: String(raw.title ?? raw.slug ?? ""),
				summary: String(raw.summary ?? ""),
				platform: raw.platform === "native" ? "native" : "web",
			});
		} catch {
			// Skip malformed recipe files rather than failing the whole list.
		}
	}
	return out.sort((a, b) => a.slug.localeCompare(b.slug));
}
