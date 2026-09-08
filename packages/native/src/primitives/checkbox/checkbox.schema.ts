import { checkboxSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeCheckboxSchema = deriveNativeSchema(checkboxSchema, {
	description:
		"A square box the user ticks. Controlled only on native — pass checked and onCheckedChange together — and it extends its own touch target beyond the 16pt box.",
	removeProps: ["defaultChecked", "required"],
	addProps: [
		{
			name: "hitSlop",
			type: "number",
			required: false,
			default: 12,
			description: "Extra tappable area in points around the visible box. Defaults to 12 so the target clears the 44pt minimum.",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/checkbox", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "With a label",
			description: "The label names the box and enlarges the tap area",
			code: '<View className="flex-row items-center gap-2">\n  <Checkbox\n    aria-labelledby="terms"\n    checked={accepted}\n    onCheckedChange={setAccepted}\n  />\n  <Label nativeID="terms">I accept the terms</Label>\n</View>',
			composition: ["form", "field"],
		},
		{
			title: "Multi-select list",
			description: "One controlled box per row, keyed by id",
			code: '<View className="gap-3">\n  {options.map((option) => (\n    <View key={option.id} className="flex-row items-center gap-2">\n      <Checkbox\n        aria-labelledby={option.id}\n        checked={selected.includes(option.id)}\n        onCheckedChange={(next) => toggle(option.id, next)}\n      />\n      <Label nativeID={option.id}>{option.label}</Label>\n    </View>\n  ))}\n</View>',
			composition: ["form", "list"],
		},
		{
			title: "Disabled",
			description: "Dim both the box and its label",
			code: '<View className="flex-row items-center gap-2">\n  <Checkbox aria-labelledby="locked" checked disabled onCheckedChange={() => {}} />\n  <Label nativeID="locked" disabled>Included in every plan</Label>\n</View>',
			composition: ["form", "disabled"],
		},
	],
	ai: {
		whenToUse:
			"Use for boolean choices submitted with a form — accepting terms, opting in, selecting several items from a list. Always pair with a Label and keep the state in the parent.",
		whenNotToUse:
			"Don't use for a setting that takes effect immediately (use Switch, which is also the platform-native idiom on a phone). Don't use for mutually exclusive options (use RadioGroup). Don't use for an indeterminate parent state — the native primitive has no indeterminate value.",
		commonMistakes: [
			"Rendering it uncontrolled — the native primitive requires both checked and onCheckedChange, and without them the box never visibly ticks no matter how many times it is tapped",
			"Passing defaultChecked as on the web — there is no uncontrolled mode here; seed the parent state instead",
			"Removing hitSlop to make the layout tighter — the visible box is 16pt, so without the extra area the target is far below the 44pt minimum and the control is hard to hit",
			"Expecting an indeterminate state — onCheckedChange is called with a boolean only; model a partially-selected parent yourself",
			"Using a checkbox for an instant-effect setting in a settings screen, where a Switch is what a phone user expects",
		],
		relatedComponents: ["native-label", "native-switch", "native-text"],
		accessibilityNotes:
			"The primitive sets role=\"checkbox\" and reports the checked state, so VoiceOver and TalkBack announce both name and state. Name it by pairing a Label's nativeID with aria-labelledby. That carries the name only, not the press: give the Label an onPress calling the same handler so the caption becomes a second target for so small a control. Keep hitSlop so the touch target clears 44pt. The disabled state dims the box and is announced.",
	},
});
