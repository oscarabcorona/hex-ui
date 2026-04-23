import { Command } from "commander";

const program = new Command();

program.name("hex").description("Hex UI — AI-native component library").version("0.1.0");

program
	.command("list")
	.description("List all available Hex UI components")
	.action(async () => {
		const { listComponents } = await import("./commands/list.js");
		await listComponents();
	});

program
	.command("add")
	.description("Add a component to your project")
	.argument("<components...>", "Component names to add")
	.option("-y, --yes", "Skip confirmation prompts", false)
	.option("-o, --overwrite", "Overwrite existing files", false)
	.option("--no-deps", "Don't install internal component dependencies recursively")
	.action(
		async (
			components: string[],
			options: { yes: boolean; overwrite: boolean; deps: boolean },
		) => {
			const { addComponents } = await import("./commands/add.js");
			await addComponents(components, options);
		},
	);

program
	.command("init")
	.description("Initialize Hex UI in your project")
	.option("--theme <theme>", "Theme to use", "default")
	.action(async (options: { theme: string }) => {
		const { initProject } = await import("./commands/init.js");
		await initProject(options);
	});

const recipe = program
	.command("recipe")
	.description("Work with Hex UI recipes (spec-driven blueprints: auth-form, settings-page, ...)");

recipe
	.command("list")
	.description("List all available recipes")
	.action(async () => {
		const { listRecipes } = await import("./commands/recipe.js");
		await listRecipes();
	});

recipe
	.command("add")
	.description("Install every component in a recipe, then print its checklist")
	.argument("<slug>", "Recipe slug (e.g. auth-form, settings-page)")
	.option("-y, --yes", "Skip confirmation prompts", false)
	.option("-o, --overwrite", "Overwrite existing files", false)
	.action(async (slug: string, options: { yes: boolean; overwrite: boolean }) => {
		const { addRecipe } = await import("./commands/recipe.js");
		await addRecipe(slug, options);
	});

const skills = program
	.command("skills")
	.description("Manage Hex UI agent skills (SKILL.md packs for Claude Code)");

skills
	.command("install")
	.description("Copy Hex UI skills into .claude/skills/ (or a custom --target)")
	.option("-t, --target <path>", "Target directory (default: .claude/skills/)")
	.option("-o, --overwrite", "Replace existing skill directories", false)
	.action(async (options: { target?: string; overwrite: boolean }) => {
		const { installSkills } = await import("./commands/skills.js");
		await installSkills(options);
	});

program.parse();
