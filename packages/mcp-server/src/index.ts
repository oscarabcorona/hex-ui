import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadRegistry, loadRegistryItem } from "./tools/registry-loader.js";
import {
	generateGlobalsCss,
	getTheme,
	listThemes,
	themeToFlatJson,
	themeToTailwindConfig,
} from "./tools/theme-loader.js";

const registry = loadRegistry();

const server = new McpServer({
	name: "hex-ui",
	version: "0.1.0",
});

// ─── Tool 1: search_components ───

server.tool(
	"search_components",
	"Search for Hex UI components by name, description, category, or tags. Returns lightweight summaries for discovery.",
	{
		query: z
			.string()
			.optional()
			.describe("Search query to match against name, description, and tags"),
		category: z
			.enum(["primitive", "component", "block", "example", "hook", "lib"])
			.optional()
			.describe("Filter by category"),
		tags: z.array(z.string()).optional().describe("Filter by tags (matches any)"),
	},
	async ({ query, category, tags }) => {
		let items = registry.items;

		if (category) {
			items = items.filter((item) => item.category === category);
		}

		if (tags && tags.length > 0) {
			items = items.filter((item) => tags.some((tag) => item.tags.includes(tag)));
		}

		if (query) {
			const q = query.toLowerCase();
			items = items.filter(
				(item) =>
					item.name.includes(q) ||
					item.displayName.toLowerCase().includes(q) ||
					item.description.toLowerCase().includes(q) ||
					item.tags.some((t) => t.includes(q)),
			);
		}

		if (items.length === 0) {
			return {
				content: [
					{
						type: "text" as const,
						text: "No components found matching your query.",
					},
				],
			};
		}

		const results = items.map((item) => ({
			name: item.name,
			displayName: item.displayName,
			description: item.description,
			category: item.category,
			subcategory: item.subcategory,
			tags: item.tags,
			tokenBudget: item.tokenBudget,
		}));

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(results, null, 2),
				},
			],
		};
	},
);

// ─── Tool 2: get_component ───

server.tool(
	"get_component",
	"Get the full Hex UI component definition including source code, props, variants, examples, and AI hints. Use this to install a component into a project.",
	{
		name: z.string().describe("Component name (e.g. 'button', 'input', 'label')"),
		includeExamples: z.boolean().optional().default(true).describe("Include usage examples"),
	},
	async ({ name, includeExamples }) => {
		const item = loadRegistryItem(name);
		if (!item) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Component "${name}" not found. Use search_components to discover available components.`,
					},
				],
			};
		}

		const result = includeExamples ? item : { ...item, examples: [] };

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

// ─── Tool 3: get_component_schema ───

server.tool(
	"get_component_schema",
	"Get just the props, variants, slots, and AI hints for a component — without the full source code. Use this when you need to know HOW to use a component that's already installed.",
	{
		name: z.string().describe("Component name"),
	},
	async ({ name }) => {
		const item = loadRegistryItem(name);
		if (!item) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Component "${name}" not found.`,
					},
				],
			};
		}

		const schema = {
			name: item.name,
			displayName: item.displayName,
			description: item.description,
			props: item.props,
			variants: item.variants,
			slots: item.slots,
			ai: item.ai,
			examples: item.examples,
		};

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(schema, null, 2),
				},
			],
		};
	},
);

// ─── Tool 4: get_theme ───

server.tool(
	"get_theme",
	"Get a Hex UI theme in the specified format. Use 'css' for globals.css, 'json' for flat token map (most token-efficient for AI), 'tailwind' for Tailwind config extension.",
	{
		name: z.string().describe("Theme name (e.g. 'default', 'midnight', 'ember')"),
		format: z.enum(["css", "json", "tailwind"]).optional().default("css").describe("Output format"),
		mode: z
			.enum(["light", "dark"])
			.optional()
			.default("light")
			.describe("Color mode (only for json format)"),
	},
	async ({ name, format, mode }) => {
		const theme = getTheme(name);
		if (!theme) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Theme "${name}" not found. Available: ${listThemes()
							.map((t) => t.name)
							.join(", ")}`,
					},
				],
			};
		}

		let output: string;
		switch (format) {
			case "css":
				output = generateGlobalsCss(theme);
				break;
			case "json":
				output = JSON.stringify(themeToFlatJson(theme, mode), null, 2);
				break;
			case "tailwind":
				output = JSON.stringify(themeToTailwindConfig(theme), null, 2);
				break;
			default:
				output = generateGlobalsCss(theme);
		}

		return {
			content: [
				{
					type: "text" as const,
					text: output,
				},
			],
		};
	},
);

// ─── Tool 5: list_themes ───

server.tool(
	"list_themes",
	"List all available Hex UI themes with their names and descriptions.",
	{},
	async () => {
		const themeList = listThemes();
		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(themeList, null, 2),
				},
			],
		};
	},
);

// ─── Tool 6: scaffold_project ───

server.tool(
	"scaffold_project",
	"Generate a complete file tree to set up Hex UI in a project. Returns the config file, globals.css with theme tokens, tailwind config extension, utility functions, and requested components.",
	{
		components: z.array(z.string()).describe("Component names to include"),
		theme: z.string().optional().default("default").describe("Theme name"),
	},
	async ({ components, theme: themeName }) => {
		const theme = getTheme(themeName);
		if (!theme) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Theme "${themeName}" not found.`,
					},
				],
			};
		}

		const files: Array<{ path: string; content: string }> = [];

		// 1. globals.css with theme
		files.push({
			path: "app/globals.css",
			content: generateGlobalsCss(theme),
		});

		// 2. Tailwind config extension
		const twConfig = themeToTailwindConfig(theme);
		files.push({
			path: "tailwind.config.ts (extend section)",
			content: JSON.stringify({ theme: { extend: twConfig } }, null, 2),
		});

		// 3. cn utility
		files.push({
			path: "lib/utils.ts",
			content: `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n\treturn twMerge(clsx(inputs));\n}\n`,
		});

		// 4. Each requested component
		for (const compName of components) {
			const item = loadRegistryItem(compName);
			if (!item) continue;

			for (const file of item.files) {
				if (file.type === "component") {
					files.push({
						path: file.path,
						content: file.content,
					});
				}
			}
		}

		// 5. npm dependencies
		const allNpmDeps = new Set<string>(["clsx", "tailwind-merge"]);
		for (const compName of components) {
			const item = loadRegistryItem(compName);
			if (!item) continue;
			const deps = item.dependencies as { npm?: string[] };
			if (deps.npm) {
				for (const dep of deps.npm) {
					allNpmDeps.add(dep);
				}
			}
		}

		const result = {
			files,
			npmDependencies: [...allNpmDeps].sort(),
			installCommand: `pnpm add ${[...allNpmDeps].sort().join(" ")}`,
		};

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

// ─── Tool 7: customize_component ───

server.tool(
	"customize_component",
	"Get a component with customizations applied. Specify CSS variable overrides or additional Tailwind classes to inject.",
	{
		name: z.string().describe("Component name"),
		cssOverrides: z
			.record(
				z.string(),
				z.object({
					light: z.string(),
					dark: z.string(),
				}),
			)
			.optional()
			.describe(
				"CSS variable overrides (e.g. { '--primary': { light: '220 90% 56%', dark: '220 80% 66%' } })",
			),
		additionalClasses: z
			.string()
			.optional()
			.describe("Additional Tailwind classes to add to the root element"),
	},
	async ({ name, cssOverrides, additionalClasses }) => {
		const item = loadRegistryItem(name);
		if (!item) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Component "${name}" not found.`,
					},
				],
			};
		}

		const result: Record<string, unknown> = { ...item };

		if (cssOverrides) {
			result.cssVariables = {
				...(item.cssVariables ?? {}),
				...cssOverrides,
			};
		}

		if (additionalClasses) {
			result.customization = {
				additionalClasses,
				note: `Add "${additionalClasses}" to the component's root className to apply customization.`,
			};
		}

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
);

// ─── Resources ───

server.resource(
	"catalog",
	"hex://catalog",
	{
		description: "Full Hex UI component catalog — lightweight index of all available components",
		mimeType: "application/json",
	},
	async () => ({
		contents: [
			{
				uri: "hex://catalog",
				mimeType: "application/json",
				text: JSON.stringify(registry, null, 2),
			},
		],
	}),
);

// ─── Start Server ───

/** Initialize the MCP stdio transport and start the Hex UI server. */
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch(console.error);
