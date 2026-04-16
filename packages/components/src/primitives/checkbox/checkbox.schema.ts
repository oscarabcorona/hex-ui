import type { ComponentSchemaDefinition } from "@hex-ui/registry";

export const checkboxSchema: ComponentSchemaDefinition = {
	name: "checkbox",
	displayName: "Checkbox",
	description: "An accessible checkbox with checked, unchecked, and indeterminate states. Built on Radix UI.",
	category: "primitive",
	subcategory: "forms",
	props: [
		{ name: "checked", type: "boolean", required: false, description: "Controlled checked state" },
		{ name: "defaultChecked", type: "boolean", required: false, description: "Default checked for uncontrolled" },
		{ name: "onCheckedChange", type: "function", required: false, description: "Callback: (checked: boolean | 'indeterminate') => void" },
		{ name: "disabled", type: "boolean", required: false, default: false, description: "Disable the checkbox" },
		{ name: "required", type: "boolean", required: false, default: false, description: "Mark as required for form validation" },
		{ name: "className", type: "string", required: false, description: "Additional CSS classes" },
	],
	variants: [],
	slots: [],
	dependencies: {
		npm: ["@radix-ui/react-checkbox", "clsx", "tailwind-merge"],
		internal: [],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["input", "primary", "primary-foreground", "ring"],
	examples: [
		{ title: "Basic", description: "Checkbox with label", code: '<div className="flex items-center gap-2">\n  <Checkbox id="terms" />\n  <Label htmlFor="terms">Accept terms</Label>\n</div>' },
		{ title: "Controlled", description: "Controlled checkbox", code: 'const [checked, setChecked] = useState(false);\n<Checkbox checked={checked} onCheckedChange={setChecked} />' },
	],
	ai: {
		whenToUse: "Use for boolean toggles in forms: agree to terms, enable options, select items in a list.",
		whenNotToUse: "Don't use for mutually exclusive options (use RadioGroup). Don't use for instant toggles (use Switch).",
		commonMistakes: ["Missing Label pairing", "Using onChange instead of onCheckedChange"],
		relatedComponents: ["label", "switch", "form"],
		accessibilityNotes: "Always pair with Label via htmlFor/id. Radix handles aria-checked automatically.",
		tokenBudget: 300,
	},
	tags: ["checkbox", "form", "toggle", "boolean", "check"],
};
