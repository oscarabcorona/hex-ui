import FlexSearch, { type Document } from "flexsearch";
import { listComponents, type RegistryIndexItem } from "./registry";

/** Consumer-facing hit shape. `href` is derived at read time. */
export interface SearchResult {
	name: string;
	displayName: string;
	description: string;
	category: string;
	href: string;
}

/** Internal index doc. Kept type-clean for our own code. */
interface IndexDoc {
	name: string;
	displayName: string;
	description: string;
	category: string;
	tags: string;
}

/**
 * Boundary type for FlexSearch — its `Document<T>` generic requires
 * `T extends Record<string, unknown>`. We mirror IndexDoc as a string-keyed
 * record solely to satisfy the library; our own code never touches this type
 * directly.
 */
type IndexDocRecord = IndexDoc & Record<string, string>;

type DocsIndex = Document<IndexDocRecord, true>;

let cachedIndex: DocsIndex | null = null;

function toIndexDoc(item: RegistryIndexItem): IndexDocRecord {
	return {
		name: item.name,
		displayName: item.displayName,
		description: item.description,
		category: item.category,
		tags: (item.tags ?? []).join(" "),
	};
}

function buildIndex(): DocsIndex {
	const idx: DocsIndex = new FlexSearch.Document({
		document: {
			id: "name",
			index: ["displayName", "description", "category", "name", "tags"],
			store: ["name", "displayName", "description", "category"],
		},
		tokenize: "forward",
	});
	for (const item of listComponents()) {
		idx.add(toIndexDoc(item));
	}
	return idx;
}

function getIndex(): DocsIndex {
	if (!cachedIndex) cachedIndex = buildIndex();
	return cachedIndex;
}

/** Narrow an unknown FlexSearch payload down to our IndexDoc shape. */
function isIndexDoc(value: unknown): value is IndexDoc {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.name === "string" &&
		typeof v.displayName === "string" &&
		typeof v.description === "string" &&
		typeof v.category === "string"
	);
}

function toResult(item: { name: string; displayName: string; description: string; category: string }): SearchResult {
	return {
		name: item.name,
		displayName: item.displayName,
		description: item.description,
		category: item.category,
		href: `/docs/components/${item.name}`,
	};
}

/**
 * Search the component registry. Empty query returns first `limit` items in
 * registry order. Matches across name, displayName, description, category,
 * and tags.
 */
export function search(query: string, limit = 8): SearchResult[] {
	const trimmed = query.trim();
	if (!trimmed) {
		return listComponents().slice(0, limit).map(toResult);
	}
	const raw: unknown = getIndex().search(trimmed, { limit, enrich: true });
	if (!Array.isArray(raw)) return [];
	const seen = new Set<string>();
	const results: SearchResult[] = [];
	for (const group of raw) {
		if (!group || typeof group !== "object") continue;
		const groupResult = (group as { result?: unknown }).result;
		if (!Array.isArray(groupResult)) continue;
		for (const hit of groupResult) {
			if (!hit || typeof hit !== "object") continue;
			const doc = (hit as { doc?: unknown }).doc;
			if (!isIndexDoc(doc) || seen.has(doc.name)) continue;
			seen.add(doc.name);
			results.push(toResult(doc));
			if (results.length >= limit) return results;
		}
	}
	return results;
}

/**
 * A small set of commonly-used components. Used as the "try these" hint in
 * the search palette's empty-results state. Pads from the registry head when
 * the curated list is short so callers always get `limit` entries.
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
		hits.push(toResult(item));
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
