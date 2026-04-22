import type { RecipeDefinition } from "../recipe-schema.js";

export const pricingTableRecipe: RecipeDefinition = {
	slug: "pricing-table",
	title: "Pricing table",
	summary:
		"Three-tier pricing grid with a highlighted plan, feature list per tier, CTAs, and tooltips for advanced features.",
	tags: ["pricing", "marketing", "saas", "landing"],
	brief:
		"Build a marketing pricing section with three plans side-by-side. Highlight the middle (recommended) plan. Each plan has a title, price, a list of features, and a CTA button. Hovering a feature with an 'info' hint shows a tooltip.",
	steps: [
		{ component: "card", reason: "Container for each pricing tier", role: "primary" },
		{ component: "badge", reason: "'Recommended' flag on the highlighted tier", role: "supporting" },
		{ component: "separator", reason: "Divides header from feature list", role: "supporting" },
		{
			component: "tooltip",
			reason: "Progressive disclosure for nuanced feature descriptions",
			role: "optional",
		},
		{ component: "button", reason: "Per-tier conversion CTA", role: "primary" },
	],
	checklist: [
		{
			id: "recommended-visual-emphasis",
			check: "Recommended tier has visible emphasis (border or ring) plus the badge.",
			severity: "warn",
			source: "author",
		},
		{
			id: "cta-aria-label",
			check: "CTA button's aria-label names the plan (e.g. 'Choose Pro') when text is generic.",
			severity: "warn",
			source: "author",
		},
	],
	tokenBudget: 1800,
};
