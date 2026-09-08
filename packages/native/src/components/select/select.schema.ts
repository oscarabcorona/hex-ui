import { selectSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeSelectSchema = deriveNativeSchema(selectSchema, {
	description:
		"A dropdown for choosing one option. The value is an { value, label } object rather than a bare string, because React Native has no option element for the trigger to read a label back from.",
	// The web props type value/defaultValue/onValueChange as plain strings. On
	// native they are `{ value, label }` objects, so the inherited prop table
	// contradicted this schema's own prose and would have an agent pass a
	// string that leaves the trigger blank.
	removeProps: ["name", "required", "value", "defaultValue", "onValueChange"],
	addProps: [
		{
			name: "value",
			type: "object",
			required: false,
			description:
				"Controlled selection as `{ value, label }`, or undefined for none. React Native has no option element for the trigger to read a label back from, so the label travels with the value.",
		},
		{
			name: "defaultValue",
			type: "object",
			required: false,
			description: "Initial selection as `{ value, label }` when the Select manages its own state",
		},
		{
			name: "onValueChange",
			type: "function",
			required: false,
			description: "Called with the chosen `{ value, label }`, or undefined when the selection is cleared",
		},
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/select", "@rn-primitives/portal", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Choosing a plan",
			description: "Each item carries both value and label; the trigger shows the label",
			code: '<Select value={plan} onValueChange={setPlan}>\n  <SelectTrigger>\n    <SelectValue placeholder="Pick a plan" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="free" label="Free" />\n    <SelectItem value="pro" label="Pro" />\n    <SelectItem value="team" label="Team" />\n  </SelectContent>\n</Select>',
			composition: ["form", "field"],
		},
		{
			title: "Labelled field",
			description: "Name the control the same way as any other field",
			code: '<View className="gap-1.5">\n  <Label nativeID="plan">Plan</Label>\n  <Select value={plan} onValueChange={setPlan}>\n    <SelectTrigger aria-labelledby="plan">\n      <SelectValue placeholder="Pick a plan" />\n    </SelectTrigger>\n    <SelectContent>\n      <SelectItem value="free" label="Free" />\n      <SelectItem value="pro" label="Pro" />\n    </SelectContent>\n  </Select>\n</View>',
			composition: ["form", "field"],
		},
		{
			title: "Reading the chosen value",
			description: "onValueChange hands back the whole option, or undefined when cleared",
			code: 'const [plan, setPlan] = useState<{ value: string; label: string } | undefined>();\n\n<Select value={plan} onValueChange={setPlan}>\n  <SelectTrigger>\n    <SelectValue placeholder="Pick a plan" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="free" label="Free" />\n  </SelectContent>\n</Select>',
			composition: ["form", "state"],
		},
	],
	ai: {
		whenToUse:
			"Use to choose one option from a list too long for a RadioGroup — roughly six or more — where the options are short and the chosen one should stay visible in the closed control.",
		whenNotToUse:
			"Don't use for two or three options (a RadioGroup or Tabs shows them all without a tap). Don't use for a boolean (use Switch). Don't use for a searchable or very long list; a dedicated screen with a filter is far easier on a phone.",
		commonMistakes: [
			"Passing a bare string as value — the native primitive takes an { value, label } object, and a string leaves the trigger with nothing to display",
			"Omitting label on SelectItem, which makes the trigger blank after the user picks that option",
			"Forgetting <PortalHost /> in the root layout, so the list never opens",
			"Reaching for the name or required props from the web component — both are web form-element concerns and do nothing here",
			"Using it for a list of twenty-plus options, where a phone user has to scroll a floating panel with no way to search",
		],
		relatedComponents: ["native-label", "native-radio-group", "native-text"],
		accessibilityNotes:
			"Name the trigger by pairing a Label's nativeID with aria-labelledby, and give SelectValue a placeholder so the closed control is never empty. The list is portalled and anchored to the measured trigger, so it opens once the trigger has laid out. Each option is a row at least 40pt tall, which keeps it a comfortable target. For long lists prefer a dedicated screen: a floating list on a small display is hard to scroll and hard to escape.",
	},
});
