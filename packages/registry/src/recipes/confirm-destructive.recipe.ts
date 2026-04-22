import type { RecipeDefinition } from "../recipe-schema.js";

export const confirmDestructiveRecipe: RecipeDefinition = {
	slug: "confirm-destructive",
	title: "Destructive confirm",
	summary: "Typed-name confirmation flow for irreversible actions (delete account, drop table).",
	tags: ["dialog", "confirmation", "destructive", "delete"],
	brief:
		"Guard an irreversible action (delete project, remove user) behind a confirmation dialog. The destructive button is disabled until the user types the resource name.",
	steps: [
		{
			component: "alert-dialog",
			reason: "Modal that blocks other interaction until resolved",
			role: "primary",
		},
		{ component: "button", reason: "Destructive-variant CTA to open the dialog", role: "primary" },
		{ component: "input", reason: "Typed-confirmation field inside the dialog", role: "supporting" },
		{ component: "label", reason: "Labels the confirmation input", role: "supporting" },
	],
	checklist: [
		{
			id: "typed-confirm-guard",
			check: "Confirm button stays disabled until the input matches the resource name exactly.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "destructive-variant",
			check: "Confirm button uses Button variant='destructive', not default.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "cancel-is-default",
			check: "Cancel is the default/focus action, not Confirm.",
			severity: "warn",
			source: "author",
		},
	],
	tokenBudget: 1400,
};
