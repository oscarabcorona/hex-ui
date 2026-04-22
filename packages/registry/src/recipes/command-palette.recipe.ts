import type { RecipeDefinition } from "../recipe-schema.js";

export const commandPaletteRecipe: RecipeDefinition = {
	slug: "command-palette",
	title: "Command palette",
	summary:
		"Cmd-K quick-open palette with grouped actions, search, and keyboard-first navigation.",
	tags: ["command", "palette", "cmdk", "search", "shortcuts"],
	brief:
		"Add a Cmd-K / Ctrl-K command palette that opens a dialog, offers a fuzzy-search input, and lists grouped actions (Navigate, Recent, Settings) with keyboard arrow navigation.",
	steps: [
		{ component: "command", reason: "Fuzzy search + grouped list primitive", role: "primary" },
		{ component: "dialog", reason: "Modal shell the command lives inside", role: "primary" },
		{
			component: "separator",
			reason: "Visual divider between command groups",
			role: "supporting",
		},
	],
	checklist: [
		{
			id: "keyboard-shortcut",
			check: "Global Cmd-K / Ctrl-K listener opens the dialog (and only inside client code).",
			severity: "blocker",
			source: "author",
		},
		{
			id: "close-on-select",
			check: "Dialog closes after a command is selected, before the action runs.",
			severity: "warn",
			source: "author",
		},
		{
			id: "empty-state",
			check: "Palette shows a friendly empty state when no commands match the query.",
			severity: "nit",
			source: "author",
		},
	],
	tokenBudget: 1600,
};
