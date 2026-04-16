import "server-only";
import type { RegistryItem } from "./registry";

/**
 * Load a full registry item by slug. Server-only to avoid bundling every JSON
 * payload into the client chunk.
 * @param slug - Component name, e.g. "button"
 * @returns The full registry item, or null if not found
 */
export async function getRegistryItem(slug: string): Promise<RegistryItem | null> {
	try {
		const item = await import(`../../../../registry/items/${slug}.json`);
		return item.default as RegistryItem;
	} catch {
		return null;
	}
}
