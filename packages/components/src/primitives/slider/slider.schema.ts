import type { ComponentSchemaDefinition } from "@hex-ui/registry";

export const sliderSchema: ComponentSchemaDefinition = {
	name: "slider",
	displayName: "Slider",
	description:
		"A range input with draggable thumbs. Supports single value, ranges (two thumbs), custom steps, and full keyboard control.",
	category: "primitive",
	subcategory: "forms",
	props: [
		{
			name: "value",
			type: "object",
			required: false,
			description:
				"Controlled array of thumb values (number[]), e.g. [50] for single, [20, 80] for range",
		},
		{
			name: "defaultValue",
			type: "object",
			required: false,
			description: "Default array of thumb values (number[]) for uncontrolled usage",
		},
		{
			name: "onValueChange",
			type: "function",
			required: false,
			description: "Callback on value change: (value: number[]) => void",
		},
		{ name: "min", type: "number", required: false, default: 0, description: "Minimum value" },
		{ name: "max", type: "number", required: false, default: 100, description: "Maximum value" },
		{
			name: "step",
			type: "number",
			required: false,
			default: 1,
			description: "Step interval between valid values",
		},
		{
			name: "disabled",
			type: "boolean",
			required: false,
			default: false,
			description: "Disable the slider",
		},
		{
			name: "orientation",
			type: "enum",
			required: false,
			default: "horizontal",
			description: "Slider direction",
			enumValues: ["horizontal", "vertical"],
		},
	],
	variants: [],
	slots: [],
	dependencies: {
		npm: ["@radix-ui/react-slider", "clsx", "tailwind-merge"],
		internal: [],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["secondary", "primary", "background", "ring"],
	examples: [
		{
			title: "Basic slider",
			description: "Single-thumb slider",
			code: '<Slider defaultValue={[50]} max={100} step={1} />',
		},
		{
			title: "Range slider",
			description: "Two-thumb range",
			code: '<Slider defaultValue={[20, 80]} max={100} step={1} />',
		},
	],
	ai: {
		whenToUse:
			"Use for continuous numeric inputs with a known range: volume, brightness, price range filter, opacity. Pair value with a visible number display when the exact value matters.",
		whenNotToUse:
			"Don't use when the user needs to enter an exact number (use Input type=number). Don't use for discrete choices (use Select or RadioGroup).",
		commonMistakes: [
			"Using Slider for exact values without showing the number",
			"Missing min/max bounds",
			"Using step=1 for fractional values (set step=0.01)",
			"Not providing aria-label when there's no visible label",
		],
		relatedComponents: ["input"],
		accessibilityNotes:
			"Arrow keys step by step, Home/End jump to min/max, PageUp/PageDown step larger. Radix handles aria-valuemin/max/now. Add aria-label if no visible label.",
		tokenBudget: 450,
	},
	tags: ["slider", "range", "form", "numeric", "input"],
};
