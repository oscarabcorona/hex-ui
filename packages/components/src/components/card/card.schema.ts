import type { ComponentSchemaDefinition } from "@hex-ui/registry";

export const cardSchema: ComponentSchemaDefinition = {
	name: "card",
	displayName: "Card",
	description: "A container component with header, content, and footer sections. Includes subtle shadow and hover effects.",
	category: "component",
	subcategory: "layout",
	props: [
		{ name: "className", type: "string", required: false, description: "Additional CSS classes on the root card" },
	],
	variants: [],
	slots: [
		{ name: "children", description: "Card content — use CardHeader, CardContent, CardFooter subcomponents", required: true, acceptedTypes: ["ReactNode"] },
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: [],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["card", "card-foreground", "border", "muted-foreground"],
	examples: [
		{
			title: "Complete card",
			description: "Card with all sections",
			code: '<Card>\n  <CardHeader>\n    <CardTitle>Create project</CardTitle>\n    <CardDescription>Deploy your new project in one-click.</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p>Card content here</p>\n  </CardContent>\n  <CardFooter>\n    <Button>Deploy</Button>\n  </CardFooter>\n</Card>',
		},
	],
	ai: {
		whenToUse: "Use to group related content with a visual boundary: settings panels, product listings, dashboard widgets, form sections.",
		whenNotToUse: "Don't use for full-page layouts (use plain divs). Don't nest cards inside cards.",
		commonMistakes: ["Nesting cards", "Using Card when a simple div with border would suffice", "Forgetting CardContent padding when placing forms inside"],
		relatedComponents: ["button", "separator"],
		accessibilityNotes: "Card is a div by default. Add role='region' and aria-label for landmark cards. CardTitle renders h3 — ensure heading hierarchy.",
		tokenBudget: 400,
	},
	tags: ["card", "container", "panel", "layout", "surface"],
};
