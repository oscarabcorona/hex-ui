import type { RecipeDefinition } from "../recipe-schema.js";

export const dataTableViewRecipe: RecipeDefinition = {
	slug: "data-table-view",
	title: "Data table view",
	summary:
		"Searchable, paginated data table with row actions menu, status badges, and empty state.",
	tags: ["data-table", "crud", "list", "admin", "dashboard"],
	brief:
		"Build a list screen for a resource (users, invoices, etc.) with a search input, a paginated data table, a per-row dropdown of actions, and status badges in one of the columns.",
	steps: [
		{ component: "data-table", reason: "Sortable, paginated table primitive", role: "primary" },
		{ component: "input", reason: "Top-of-page search box", role: "supporting" },
		{
			component: "dropdown-menu",
			reason: "Per-row actions (edit, archive, delete)",
			role: "supporting",
		},
		{ component: "badge", reason: "Status cell rendering", role: "supporting" },
		{ component: "pagination", reason: "Page navigation below the table", role: "supporting" },
		{ component: "button", reason: "Primary action (New / Import)", role: "supporting" },
	],
	checklist: [
		{
			id: "search-debounced",
			check: "Search input is debounced (200–300ms) before hitting server or filtering.",
			severity: "warn",
			source: "author",
		},
		{
			id: "destructive-requires-confirm",
			check: "Destructive row actions (delete) route through AlertDialog, not a bare click.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "empty-state",
			check: "Empty result set renders a helpful empty state, not a blank table.",
			severity: "warn",
			source: "author",
		},
	],
	tokenBudget: 3000,
};
