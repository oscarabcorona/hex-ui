import FlexSearch from "flexsearch";
import { listComponents } from "./registry";

export interface SearchResult {
	name: string;
	displayName: string;
	description: string;
	category: string;
	href: string;
	[key: string]: string;
}

const items = listComponents();

const index = new FlexSearch.Document<SearchResult, true>({
	document: {
		id: "name",
		index: ["displayName", "description", "category", "name"],
		store: ["name", "displayName", "description", "category", "href"],
	},
	tokenize: "forward",
});

for (const item of items) {
	index.add({
		name: item.name,
		displayName: item.displayName,
		description: item.description,
		category: item.category,
		href: `/docs/components/${item.name}`,
	});
}

/**
 * Search the component registry. Empty query returns all items.
 * Deduplicates matches that hit across multiple fields.
 */
export function search(query: string, limit = 8): SearchResult[] {
	const trimmed = query.trim();
	if (!trimmed) {
		return items.slice(0, limit).map((i) => ({
			name: i.name,
			displayName: i.displayName,
			description: i.description,
			category: i.category,
			href: `/docs/components/${i.name}`,
		}));
	}
	const raw = index.search(trimmed, { limit, enrich: true }) as unknown as Array<{
		field: string;
		result: Array<{ id: string; doc: SearchResult }>;
	}>;
	const seen = new Set<string>();
	const results: SearchResult[] = [];
	for (const group of raw) {
		for (const hit of group.result) {
			const doc = hit.doc;
			if (!doc || seen.has(doc.name)) continue;
			seen.add(doc.name);
			results.push(doc);
			if (results.length >= limit) return results;
		}
	}
	return results;
}
