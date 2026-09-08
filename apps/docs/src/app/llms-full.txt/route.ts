import recipesIndex from "../../../../../registry/recipes.json";
import { GETTING_STARTED_NAV } from "../../lib/docs-nav";
import { buildLlmsFullTxt, type LlmsCatalogGroup } from "../../lib/llms";
import {
	CATEGORY_LABELS,
	CATEGORY_ORDER,
	componentsByCategory,
	installCommand,
	listComponents,
	listNativeComponents,
	type RegistryIndexItem,
} from "../../lib/registry";
import { getRegistryItem } from "../../lib/registry.server";
import { HEX_REGISTRY_NAMESPACE, HEX_REGISTRY_TEMPLATE, SITE_URL } from "../../lib/site";

/** Prerendered — derives only from committed registry data and the nav. */
export const dynamic = "force-static";

/**
 * Assemble the catalog groups: every category in display order, every item
 * with its `whenToUse` intent from the full registry item. Throws when an
 * item fails to load — a malformed registry should fail the build here, not
 * serve a silently shorter catalog.
 * @returns Ordered category groups for the llms-full catalog section
 */
async function loadCatalog(): Promise<LlmsCatalogGroup[]> {
	const covered = new Set<string>(CATEGORY_ORDER);
	// Both catalogs. The guard exists so an item in an uncovered category
	// fails the build rather than being silently dropped from the agent
	// index — and checking only the web list reintroduced exactly that hole
	// for the 26 native items.
	const missing = [...listComponents(), ...listNativeComponents()].filter(
		(item) => !covered.has(item.category),
	);
	if (missing.length > 0) {
		throw new Error(
			`CATEGORY_ORDER does not cover: ${[...new Set(missing.map((m) => m.category))].join(", ")}`,
		);
	}

	/**
	 * Expand index summaries into catalog rows, reading each item's
	 * `whenToUse` from the full registry item.
	 * @param items - Index entries to expand
	 * @returns Catalog rows in the same order
	 */
	const expand = async (items: readonly RegistryIndexItem[]) =>
		Promise.all(
			items.map(async (summary) => {
				const item = await getRegistryItem(summary.name);
				if (!item) throw new Error(`Registry item failed to load: ${summary.name}`);
				return {
					name: item.name,
					displayName: item.displayName,
					description: item.description,
					whenToUse: item.ai.whenToUse,
				};
			}),
		);

	const catalog: LlmsCatalogGroup[] = [];
	const webGroups = componentsByCategory();
	for (const category of CATEGORY_ORDER) {
		const items = webGroups[category] ?? [];
		if (items.length === 0) continue;
		catalog.push({ label: CATEGORY_LABELS[category] ?? category, items: await expand(items) });
	}

	// React Native items last and under their own heading. They share the
	// `primitive` / `component` categories with the web catalog, so
	// interleaving them would offer an agent building a web page a component
	// that only renders on a device — and vice versa.
	const native = listNativeComponents();
	if (native.length > 0) {
		const nativeGroups = componentsByCategory(native);
		for (const category of CATEGORY_ORDER) {
			const items = nativeGroups[category] ?? [];
			if (items.length === 0) continue;
			catalog.push({
				label: `React Native — ${CATEGORY_LABELS[category] ?? category}`,
				items: await expand(items),
			});
		}
	}

	return catalog;
}

/**
 * The deliberate-load variant of `/llms.txt`: the compact index plus every
 * catalog item's one-line intent, grouped by category.
 * @returns llms-full.txt as `text/plain`
 */
export async function GET(): Promise<Response> {
	const body = buildLlmsFullTxt({
		siteUrl: SITE_URL,
		registryTemplate: HEX_REGISTRY_TEMPLATE,
		namespace: HEX_REGISTRY_NAMESPACE,
		docs: GETTING_STARTED_NAV,
		recipes: recipesIndex.items,
		catalog: await loadCatalog(),
		installCommand,
	});
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
