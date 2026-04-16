import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Locate the registry index JSON file by searching known candidate paths.
 * @returns The absolute path to registry.json, or null if not found
 */
function findRegistryIndex(): string | null {
	const candidates = [
		path.resolve(
			path.dirname(fileURLToPath(import.meta.url)),
			"../../../../registry/registry.json",
		),
		path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../registry/registry.json"),
		path.resolve(process.cwd(), "registry/registry.json"),
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}

/**
 * Print all available components grouped by category to stdout.
 */
export async function listComponents() {
	const indexPath = findRegistryIndex();
	if (!indexPath) {
		console.error("Could not find registry. Run from the hex-ui project root.");
		process.exit(1);
	}

	const registry = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

	console.log("\nHex UI Components\n");

	const grouped: Record<string, Array<{ name: string; description: string }>> = {};
	for (const item of registry.items) {
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

	console.log(`Total: ${registry.items.length} components`);
}
