import FlexSearch, { type Document } from "flexsearch";
import { listComponents } from "./registry";

/**
 * Shape returned from `search()` — the consumer-facing record of a hit.
 * `href` is derived, not stored in the index.
 */
export interface SearchResult {
	name: string;
	displayName: string;
	description: string;
	category: string;
	href: string;
}

/** Internal index doc. Tags are joined into a single string so FlexSearch can tokenize them. */
interface IndexDoc extends Record<string, string> {
	name: string;
	displayName: string;
	description: string;
	category: string;
	tags: string;
}

let cachedIndex: Document<IndexDoc, true> | null = null;

function buildIndex(): Document<IndexDoc, true> {
	const idx = new FlexSearch.Document<IndexDoc, true>({
		document: {
			id: "name",
			index: ["displayName", "description", "category", "name", "tags"],
			store: ["name", "displayName", "description", "category"],
		},
		tokenize: "forward",
	});
	for (const item of listComponents()) {
		idx.add({
			name: item.name,
			displayName: item.displayName,
			description: item.description,
			category: item.category,
			tags: (item.tags ?? []).join(" "),
		});
	}
	return idx;
}

/** Lazily build the FlexSearch index on first query. */
function getIndex(): Document<IndexDoc, true> {
	if (!cachedIndex) cachedIndex = buildIndex();
	return cachedIndex;
}

function toResult(doc: IndexDoc): SearchResult {
	return {
		name: doc.name,
		displayName: doc.displayName,
		description: doc.description,
		category: doc.category,
		href: `/docs/components/${doc.name}`,
	};
}

/**
 * Search the component registry. Empty query returns first `limit` items in
 * registry order (used for the palette's initial suggestion list).
 * Matches across name, displayName, description, category, and tags.
 */
export function search(query: string, limit = 8): SearchResult[] {
	const trimmed = query.trim();
	if (!trimmed) {
		return listComponents()
			.slice(0, limit)
			.map((i) => ({
				name: i.name,
				displayName: i.displayName,
				description: i.description,
				category: i.category,
				href: `/docs/components/${i.name}`,
			}));
	}
	const raw = getIndex().search(trimmed, { limit, enrich: true });
	if (!Array.isArray(raw)) return [];
	const seen = new Set<string>();
	const results: SearchResult[] = [];
	for (const group of raw) {
		if (!group || !Array.isArray(group.result)) continue;
		for (const hit of group.result) {
			const doc = hit.doc as IndexDoc | undefined;
			if (!doc || seen.has(doc.name)) continue;
			seen.add(doc.name);
			results.push(toResult(doc));
			if (results.length >= limit) return results;
		}
	}
	return results;
}

/**
 * A small set of commonly-used components. Used as the "try these" hint in
 * the search palette's empty-results state. If the curated slugs run short
 * (e.g. a rename breaks a lookup) the result is padded from the registry head
 * so callers always get `limit` entries when the registry is non-empty.
 */
export function popularComponents(limit = 5): SearchResult[] {
	const popularSlugs = ["button", "input", "dialog", "table", "form"];
	const items = listComponents();
	const map = new Map(items.map((i) => [i.name, i]));
	const seen = new Set<string>();
	const hits: SearchResult[] = [];
	const push = (slug: string) => {
		if (seen.has(slug)) return;
		const item = map.get(slug);
		if (!item) return;
		seen.add(slug);
		hits.push({
			name: item.name,
			displayName: item.displayName,
			description: item.description,
			category: item.category,
			href: `/docs/components/${item.name}`,
		});
	};
	for (const slug of popularSlugs) {
		if (hits.length >= limit) break;
		push(slug);
	}
	for (const item of items) {
		if (hits.length >= limit) break;
		push(item.name);
	}
	return hits;
}
