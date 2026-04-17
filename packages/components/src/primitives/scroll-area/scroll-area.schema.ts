import type { ComponentSchemaDefinition } from "@hex-ui/registry";

export const scrollAreaSchema: ComponentSchemaDefinition = {
	name: "scroll-area",
	displayName: "Scroll Area",
	description: "A scrollable region with custom-styled scrollbars that match the design system. Content must be explicitly sized.",
	category: "primitive",
	subcategory: "layout",
	props: [
		{
			name: "type",
			type: "enum",
			required: false,
			default: "hover",
			description: "When scrollbars are visible",
			enumValues: ["auto", "always", "scroll", "hover"],
		},
		{ name: "className", type: "string", required: false, description: "Set dimensions via Tailwind (e.g. h-72 w-48)" },
	],
	variants: [],
	slots: [
		{
			name: "children",
			description: "Any content — will be wrapped in a scrollable viewport",
			required: true,
			acceptedTypes: ["ReactNode"],
		},
	],
	dependencies: {
		npm: ["@radix-ui/react-scroll-area", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["border"],
	examples: [
		{
			title: "Fixed-height list",
			description: "50 items in a 200px-tall scrollable region",
			code: '<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">\n  {Array.from({ length: 50 }).map((_, i) => (\n    <div key={i} className="text-sm">Item {i + 1}</div>\n  ))}\n</ScrollArea>',
		},
	],
	ai: {
		whenToUse:
			"Use when you need styled scrollbars that match the design system — sidebars, code blocks, large lists in dialogs. Must have explicit dimensions (height/width).",
		whenNotToUse:
			"Don't use for the whole page (use native browser scrollbars). Don't use for content that should grow freely (omit the ScrollArea and use overflow-auto directly).",
		commonMistakes: [
			"Forgetting to set height/width — scrollbars don't appear",
			"Using for the whole page",
			"Nesting ScrollAreas (confusing UX)",
		],
		relatedComponents: [],
		accessibilityNotes:
			"Radix doesn't make the viewport focusable by default — add tabIndex={0} on a focusable child or the viewport to enable keyboard scrolling (arrow keys, PgUp/PgDn, Home/End). For long lists, consider pagination or virtualization.",
		tokenBudget: 350,
	},
	tags: ["scroll-area", "scroll", "overflow", "scrollbar", "layout"],
};
