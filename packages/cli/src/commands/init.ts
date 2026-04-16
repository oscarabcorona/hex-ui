import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Initialize a new Hex UI project by creating a hex.config.json file.
 * @param options - Initialization options
 * @param options.theme - The theme name to set in the config
 */
export async function initProject(options: { theme: string }) {
	const cwd = process.cwd();
	const configPath = path.join(cwd, "hex.config.json");

	if (fs.existsSync(configPath)) {
		console.log("hex.config.json already exists.");
		return;
	}

	const config = {
		$schema: "https://hex-ui.dev/schema/config.json",
		framework: "react",
		styling: "tailwind",
		typescript: true,
		theme: options.theme,
		aliases: {
			components: "@/components",
			lib: "@/lib",
			hooks: "@/hooks",
		},
	};

	fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
	console.log("Created hex.config.json");
	console.log(`\nNext steps:`);
	console.log(`  1. Run: hex add button input label`);
	console.log(`  2. Install deps: pnpm add clsx tailwind-merge class-variance-authority`);
}
