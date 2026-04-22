import type { RecipeDefinition } from "../recipe-schema.js";

export const settingsPageRecipe: RecipeDefinition = {
	slug: "settings-page",
	title: "Settings page",
	summary:
		"Multi-section settings screen with grouped cards, labeled form fields, toggles, and a save action per section.",
	tags: ["settings", "preferences", "account", "form"],
	brief:
		"Build a settings page grouped into cards (profile, notifications, security) with text inputs, a select, and switches. Each section has its own save button.",
	steps: [
		{ component: "card", reason: "Visual grouping for each settings section", role: "primary" },
		{ component: "separator", reason: "Divider between card header and body", role: "supporting" },
		{ component: "form", reason: "Validation + accessibility for each section", role: "primary" },
		{ component: "label", reason: "Field labels wired to inputs", role: "supporting" },
		{ component: "input", reason: "Text fields (name, email, etc.)", role: "supporting" },
		{
			component: "select",
			reason: "Dropdown for enumerated options (timezone, language)",
			role: "supporting",
		},
		{ component: "switch", reason: "On/off settings (notifications, dark mode)", role: "supporting" },
		{ component: "button", reason: "Per-section save actions", role: "primary" },
	],
	checklist: [
		{
			id: "per-section-dirty-state",
			check: "Save button is disabled until the section's form is dirty.",
			severity: "warn",
			source: "author",
		},
		{
			id: "switch-not-checkbox",
			check: "Binary settings use Switch, not Checkbox (Switch = immediate effect).",
			severity: "warn",
			source: "author",
		},
	],
	tokenBudget: 3200,
};
