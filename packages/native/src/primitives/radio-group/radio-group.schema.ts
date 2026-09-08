import { radioGroupSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeRadioGroupSchema = deriveNativeSchema(radioGroupSchema, {
	description:
		"A set of mutually exclusive options. Controlled only on native — pass value and onValueChange — with each item named by a Label through aria-labelledby.",
	removeProps: ["defaultValue", "orientation", "name"],
	dependencies: {
		npm: ["@rn-primitives/radio-group", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Plan picker",
			description: "One row per option, each label wired to its item",
			code: '<RadioGroup value={plan} onValueChange={setPlan}>\n  {plans.map((option) => (\n    <View key={option.id} className="flex-row items-center gap-2">\n      <RadioGroupItem value={option.id} aria-labelledby={`plan-${option.id}`} />\n      <Label nativeID={`plan-${option.id}`}>{option.label}</Label>\n    </View>\n  ))}\n</RadioGroup>',
			composition: ["form", "field"],
		},
		{
			title: "With per-option descriptions",
			description: "Explain each choice under its label",
			code: '<RadioGroup value={tier} onValueChange={setTier}>\n  <View className="flex-row items-start gap-2">\n    <RadioGroupItem value="standard" aria-labelledby="tier-standard" className="mt-1" />\n    <View className="flex-1">\n      <Label nativeID="tier-standard">Standard</Label>\n      <Text variant="muted">Delivered in 3-5 days.</Text>\n    </View>\n  </View>\n</RadioGroup>',
			composition: ["form", "description"],
		},
		{
			title: "Disabled group",
			description: "Disable every option at the root",
			code: '<RadioGroup value={plan} onValueChange={setPlan} disabled>\n  <View className="flex-row items-center gap-2">\n    <RadioGroupItem value="free" aria-labelledby="plan-free" />\n    <Label nativeID="plan-free" disabled>Free</Label>\n  </View>\n</RadioGroup>',
			composition: ["form", "disabled"],
		},
	],
	ai: {
		whenToUse:
			"Use when the user picks exactly one option from a short visible list — a plan, a shipping speed, a sort order. Keep the value in the parent and give every item its own Label.",
		whenNotToUse:
			"Don't use for independent on/off choices (use Checkbox per row). Don't use for more than about six options; a Select is easier to scan on a phone. Don't use for an instant-effect setting (use Switch).",
		commonMistakes: [
			"Rendering it uncontrolled — the native primitive needs value and onValueChange, and defaultValue does not exist here, so nothing selects",
			"Omitting aria-labelledby on an item — the dot has no text of its own, so VoiceOver announces an unnamed radio button",
			"Reaching for the orientation prop from the web component — it is web-only; lay the group out with flex classes instead",
			"Removing hitSlop to tighten a row, which drops the 20pt dot well below the 44pt touch minimum",
			"Using a radio group where only one option ever appears, which reads as a control the user cannot act on",
		],
		relatedComponents: ["native-label", "native-checkbox", "native-text"],
		accessibilityNotes:
			"Each item is announced as a radio with its checked state, which is what carries the meaning. The root does set role=\"radiogroup\", but React Native does not expose a plain container to assistive tech the way the DOM does, so do not rely on the group itself being announced: precede it with a Label or heading naming the choice. Every item needs its own Label paired by aria-labelledby. The pairing names the item without forwarding taps, so give each Label an onPress selecting that value — the practical way to hit a 20pt dot. Disabling at the root disables and dims every item; mirror it on the labels so the whole row reads as unavailable.",
	},
});
