import type { ComponentSchemaDefinition } from "@hex-core/registry";

export const datePickerSchema: ComponentSchemaDefinition = {
	name: "date-picker",
	displayName: "Date Picker",
	description:
		"Date input composed from Popover + Calendar. Shows the selected date formatted via date-fns, opens a calendar grid on click.",
	category: "component",
	subcategory: "input",
	props: [
		{
			name: "value",
			type: "object",
			required: false,
			description: "Controlled selected Date",
		},
		{
			name: "onChange",
			type: "function",
			required: false,
			description: "Callback when the user selects a date: (date: Date | undefined) => void",
		},
		{
			name: "placeholder",
			type: "string",
			required: false,
			default: "Pick a date",
			description: "Text shown on the trigger when no date is selected",
		},
		{
			name: "dateFormat",
			type: "string",
			required: false,
			default: "PPP",
			description: "date-fns format token for the trigger label (e.g. 'PPP', 'yyyy-MM-dd')",
		},
		{
			name: "disabled",
			type: "boolean",
			required: false,
			default: false,
			description: "Disable the picker trigger",
		},
		{
			name: "aria-label",
			type: "string",
			required: false,
			description: "Accessible label — required when no adjacent visible <label> is used",
		},
	],
	variants: [],
	slots: [],
	dependencies: {
		npm: ["react-day-picker", "date-fns", "@radix-ui/react-popover", "clsx", "tailwind-merge"],
		internal: ["components/calendar/calendar", "components/popover/popover", "lib/utils"],
		peer: ["react", "react-dom"],
	},
	tokensUsed: ["background", "border", "input", "ring", "accent", "accent-foreground", "muted-foreground"],
	examples: [
		{
			title: "Basic date picker",
			description: "Bind a Date state and render the picker",
			code: 'import { useState } from "react";\nimport { DatePicker } from "@/components/ui/date-picker";\n\nexport function Example() {\n  const [date, setDate] = useState<Date | undefined>();\n  return <DatePicker value={date} onChange={setDate} />;\n}',
		},
	],
	ai: {
		whenToUse:
			"Use for selecting a single date in a form. Shows a formatted text label and opens a month grid on click. Composes Popover + Calendar + button trigger.",
		whenNotToUse:
			"Don't use for date ranges (compose Calendar mode='range' + Popover yourself). Don't use for native mobile date UX (<input type='date'> is often better on phones). Don't use if you need time selection — combine with a separate time picker.",
		commonMistakes: [
			"Passing a string to value — must be a Date object",
			"Missing aria-label when the picker has no adjacent visible <label>",
			"Overriding className in a way that hurts focus ring visibility",
			"Forgetting that the popover auto-closes on select — provide onChange to capture the value",
		],
		relatedComponents: ["calendar", "popover", "input"],
		accessibilityNotes:
			"Trigger is a real <button> with focus ring. When rendered without a visible label, pass aria-label. The popover portals and traps keyboard focus inside Calendar until the user selects or presses Escape.",
		tokenBudget: 700,
	},
	tags: ["date-picker", "date", "input", "popover", "calendar"],
};
