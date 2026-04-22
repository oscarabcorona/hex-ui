import type { RecipeDefinition } from "../recipe-schema.js";

export const authFormRecipe: RecipeDefinition = {
	slug: "auth-form",
	title: "Auth form",
	summary:
		"Login or signup form with validated fields, remember-me, submit button, and error alert.",
	tags: ["auth", "form", "login", "signup"],
	brief:
		"Build a login page with email + password, a remember-me checkbox, a submit button, and error display.",
	steps: [
		{ component: "form", reason: "React Hook Form + zod integration wrapper", role: "primary" },
		{ component: "label", reason: "Accessible labels for each field", role: "supporting" },
		{ component: "input", reason: "Email and password fields", role: "supporting" },
		{ component: "checkbox", reason: "Remember-me toggle", role: "supporting" },
		{ component: "button", reason: "Submit CTA", role: "primary" },
		{ component: "alert", reason: "Inline error surface for failed sign-in", role: "optional" },
	],
	checklist: [
		{
			id: "password-input-type",
			check: "Password field sets type='password' and autoComplete='current-password'.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "submit-pending-state",
			check: "Submit button uses loading prop while the request is in flight.",
			severity: "warn",
			source: "author",
		},
	],
	tokenBudget: 2400,
};
