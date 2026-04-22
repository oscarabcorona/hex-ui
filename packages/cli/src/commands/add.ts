import * as fs from "node:fs";
import * as path from "node:path";
import { SLUG_REGEX } from "@hex-ui/registry";
import { findRegistryDir } from "../lib/registry-dir.js";

/**
 * Add one or more components from the registry into the current project.
 * @param components - Array of component names to add
 * @param options - Configuration flags for the add operation
 * @param options.yes - Skip confirmation prompts
 * @param options.overwrite - Overwrite existing files instead of skipping
 */
export async function addComponents(
	components: string[],
	options: { yes: boolean; overwrite: boolean },
) {
	const registryDir = findRegistryDir();
	if (!registryDir) {
		console.error("Could not find registry.");
		process.exit(1);
	}

	const cwd = process.cwd();

	for (const name of components) {
		if (!SLUG_REGEX.test(name)) {
			console.error(`Invalid component name: "${name}"`);
			continue;
		}

		const itemPath = path.join(registryDir, "items", `${name}.json`);
		if (!fs.existsSync(itemPath)) {
			console.error(`Component "${name}" not found.`);
			continue;
		}

		const item = JSON.parse(fs.readFileSync(itemPath, "utf-8"));
		console.log(`\nAdding ${item.displayName}...`);

		for (const file of item.files) {
			const targetPath = path.resolve(cwd, file.path);
			if (!targetPath.startsWith(cwd)) {
				console.error(`  Skip: ${file.path} (path escapes project directory)`);
				continue;
			}
			const targetDir = path.dirname(targetPath);

			if (fs.existsSync(targetPath) && !options.overwrite) {
				console.log(`  Skip: ${file.path} (already exists, use --overwrite)`);
				continue;
			}

			fs.mkdirSync(targetDir, { recursive: true });
			fs.writeFileSync(targetPath, file.content);
			console.log(`  Write: ${file.path}`);
		}

		// Show dependencies
		const deps = item.dependencies;
		if (deps?.npm?.length > 0) {
			console.log(`\n  Dependencies: ${deps.npm.join(", ")}`);
			console.log(`  Install: pnpm add ${deps.npm.join(" ")}`);
		}
	}
}
