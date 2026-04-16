import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_SRC = path.join(ROOT, "packages/components/src");
const REGISTRY_OUT = path.join(ROOT, "registry");
const ITEMS_OUT = path.join(REGISTRY_OUT, "items");
const LIB_DIR = path.join(COMPONENTS_SRC, "lib");

// Ensure output dirs exist
fs.mkdirSync(ITEMS_OUT, { recursive: true });

interface SchemaFile {
	category: string;
	name: string;
	schemaPath: string;
	componentPath: string;
}

/**
 * Discover all component schema files across category directories.
 * @returns An array of schema file descriptors with category, name, and file paths
 */
function findSchemaFiles(): SchemaFile[] {
	const results: SchemaFile[] = [];
	const categories = ["primitives", "components", "blocks"];

	for (const category of categories) {
		const categoryDir = path.join(COMPONENTS_SRC, category);
		if (!fs.existsSync(categoryDir)) continue;

		for (const componentDir of fs.readdirSync(categoryDir)) {
			const fullDir = path.join(categoryDir, componentDir);
			if (!fs.statSync(fullDir).isDirectory()) continue;

			const schemaFile = path.join(fullDir, `${componentDir}.schema.ts`);
			const componentFile = path.join(fullDir, `${componentDir}.tsx`);

			if (fs.existsSync(schemaFile) && fs.existsSync(componentFile)) {
				results.push({
					category: category === "primitives" ? "primitive" : category.replace(/s$/, ""),
					name: componentDir,
					schemaPath: schemaFile,
					componentPath: componentFile,
				});
			}
		}
	}

	return results;
}

/**
 * Parse and extract the schema object literal from a `.schema.ts` file.
 * @param filePath - Absolute path to the schema file
 * @returns The parsed schema object, or null if extraction fails
 */
function extractSchemaObject(filePath: string): Record<string, unknown> | null {
	const content = fs.readFileSync(filePath, "utf-8");

	// Extract the object literal from the schema file
	// Find the first { after the = sign of the export
	const exportMatch = content.match(/export\s+const\s+\w+Schema[^=]*=\s*(\{[\s\S]*\})\s*;?\s*$/m);
	if (!exportMatch) return null;

	let objStr = exportMatch[1];

	// Simple TS-to-JSON conversion:
	// Remove type annotations, convert to valid JSON-ish format
	// We'll use a Function constructor approach for safety within build scripts
	try {
		// Replace single-line comments
		objStr = objStr.replace(/\/\/.*$/gm, "");
		// The object uses JS syntax (unquoted keys, trailing commas, template literals)
		// Use eval in build context only (this is a build script, not runtime)
		const fn = new Function(`return (${objStr})`);
		return fn() as Record<string, unknown>;
	} catch {
		console.warn(`  Warning: Could not parse schema from ${filePath}`);
		return null;
	}
}

/**
 * Read a component source file as a UTF-8 string.
 * @param filePath - Absolute path to the component file
 * @returns The file contents as a string
 */
function readComponentSource(filePath: string): string {
	return fs.readFileSync(filePath, "utf-8");
}

/**
 * Read all TypeScript lib files from the shared lib directory.
 * @returns An array of file descriptors with relative path, content, and type "lib"
 */
function readLibFiles(): Array<{ path: string; content: string; type: string }> {
	const files: Array<{ path: string; content: string; type: string }> = [];
	if (!fs.existsSync(LIB_DIR)) return files;

	for (const file of fs.readdirSync(LIB_DIR)) {
		if (file.endsWith(".ts") || file.endsWith(".tsx")) {
			files.push({
				path: `lib/${file}`,
				content: fs.readFileSync(path.join(LIB_DIR, file), "utf-8"),
				type: "lib",
			});
		}
	}
	return files;
}

// ─── Main ───

console.log("Building Hex UI registry...\n");

const schemaFiles = findSchemaFiles();
const libFiles = readLibFiles();

interface RegistryIndexItem {
	name: string;
	displayName: string;
	description: string;
	category: string;
	subcategory?: string;
	tags: string[];
	internalDeps: string[];
	tokenBudget?: number;
}

const indexItems: RegistryIndexItem[] = [];

for (const sf of schemaFiles) {
	console.log(`Processing: ${sf.name} (${sf.category})`);

	const schema = extractSchemaObject(sf.schemaPath);
	if (!schema) {
		console.error(`  ERROR: Failed to parse schema for ${sf.name}`);
		continue;
	}

	const componentSource = readComponentSource(sf.componentPath);

	// Build the registry item
	const registryItem = {
		$schema: "https://hex-ui.dev/schema/registry-item.json",
		name: schema.name as string,
		displayName: schema.displayName as string,
		description: schema.description as string,
		category: schema.category as string,
		subcategory: schema.subcategory as string | undefined,
		version: "0.1.0",
		framework: "react" as const,
		props: schema.props ?? [],
		variants: schema.variants ?? [],
		slots: schema.slots ?? [],
		files: [
			{
				path: `components/ui/${sf.name}.tsx`,
				content: componentSource,
				type: "component",
			},
			...libFiles,
		],
		dependencies: schema.dependencies ?? { npm: [], internal: [], peer: [] },
		tokensUsed: schema.tokensUsed ?? [],
		examples: schema.examples ?? [],
		ai: schema.ai ?? {},
		tags: (schema.tags as string[]) ?? [],
	};

	// Write individual registry item
	const itemPath = path.join(ITEMS_OUT, `${sf.name}.json`);
	fs.writeFileSync(itemPath, JSON.stringify(registryItem, null, 2));
	console.log(`  → ${path.relative(ROOT, itemPath)}`);

	// Add to index
	const ai = schema.ai as Record<string, unknown> | undefined;
	const deps = schema.dependencies as Record<string, unknown> | undefined;

	indexItems.push({
		name: schema.name as string,
		displayName: schema.displayName as string,
		description: schema.description as string,
		category: schema.category as string,
		subcategory: schema.subcategory as string | undefined,
		tags: (schema.tags as string[]) ?? [],
		internalDeps: (deps?.internal as string[]) ?? [],
		tokenBudget: ai?.tokenBudget as number | undefined,
	});
}

// Write registry index
const registryIndex = {
	$schema: "https://hex-ui.dev/schema/registry.json",
	name: "hex-ui",
	version: "0.1.0",
	description: "Hex UI — AI-native component library for LLMs and humans",
	homepage: "https://hex-ui.dev",
	items: indexItems,
};

const indexPath = path.join(REGISTRY_OUT, "registry.json");
fs.writeFileSync(indexPath, JSON.stringify(registryIndex, null, 2));

console.log(`\n✓ Registry built: ${indexItems.length} components`);
console.log(`  Index: ${path.relative(ROOT, indexPath)}`);
