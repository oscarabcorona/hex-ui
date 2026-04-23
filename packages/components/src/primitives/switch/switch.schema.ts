import type { ComponentSchemaDefinition } from "@hex-core/registry";

export const switchSchema: ComponentSchemaDefinition = {
	name: "switch",
	displayName: "Switch",
	description: "An accessible toggle switch for instant on/off settings. Built on Radix UI.",
	category: "primitive",
	subcategory: "forms",
	props: [
		{ name: "checked", type: "boolean", required: false, description: "Controlled checked state" },
		{ name: "defaultChecked", type: "boolean", required: false, description: "Default for uncontrolled" },
		{ name: "onCheckedChange", type: "function", required: false, description: "Callback: (checked: boolean) => void" },
		{ name: "disabled", type: "boolean", required: false, default: false, description: "Disable the switch" },
		{ name: "className", type: "string", required: false, description: "Additional CSS classes" },
	],
	variants: [],
	slots: [],
	dependencies: {
		npm: ["@radix-ui/react-switch", "clsx", "tailwind-merge"],
		internal: [],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["primary", "input", "background", "ring"],
	examples: [
		{ title: "Basic", description: "Switch with label", code: '<div className="flex items-center gap-2">\n  <Switch id="airplane" />\n  <Label htmlFor="airplane">Airplane Mode</Label>\n</div>' },
	],
	ai: {
		whenToUse: "Use for settings that take effect immediately: dark mode, notifications, feature toggles.",
		whenNotToUse: "Don't use for form submissions (use Checkbox). Don't use for mutually exclusive options (use RadioGroup).",
		commonMistakes: ["Using for form fields that need explicit submit", "Missing Label"],
		relatedComponents: ["checkbox", "label", "form"],
		accessibilityNotes: "Always pair with Label. Radix handles role='switch' and aria-checked.",
		tokenBudget: 250,
	},
	tags: ["switch", "toggle", "form", "boolean", "setting"],
};
