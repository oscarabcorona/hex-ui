import { labelSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeLabelSchema = deriveNativeSchema(labelSchema, {
	description:
		"A caption naming a form control. React Native has no htmlFor, so the label carries a nativeID and the control points at it with aria-labelledby.",
	removeProps: ["htmlFor"],
	addProps: [
		{
			name: "nativeID",
			type: "string",
			required: false,
			description: "Identifier the associated control references via aria-labelledby. The React Native counterpart of htmlFor, wired in the opposite direction.",
		},
		{
			name: "disabled",
			type: "boolean",
			required: false,
			default: false,
			description: "Dim the label to match a disabled control",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/label", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Labelling an input",
			description: "The control points back at the label's nativeID",
			code: '<View className="gap-1.5">\n  <Label nativeID="email">Email address</Label>\n  <Input aria-labelledby="email" keyboardType="email-address" />\n</View>',
			composition: ["form", "field"],
		},
		{
			title: "Labelling a switch",
			description: "A settings row where the label sits beside the control",
			code: '<View className="flex-row items-center justify-between">\n  <Label nativeID="notifications">Push notifications</Label>\n  <Switch aria-labelledby="notifications" checked={enabled} onCheckedChange={setEnabled} />\n</View>',
			composition: ["form", "settings-row"],
		},
		{
			title: "Disabled field",
			description: "Dim the label with the control it names",
			code: '<View className="gap-1.5">\n  <Label nativeID="plan" disabled>Plan</Label>\n  <Input aria-labelledby="plan" editable={false} value="Enterprise" />\n</View>',
			composition: ["form", "disabled"],
		},
	],
	ai: {
		whenToUse:
			"Use to name every form control: input, textarea, checkbox, switch, radio group, select. Give the label a nativeID and point the control's aria-labelledby at it.",
		whenNotToUse:
			"Don't use it as a general text element — use Text with the 'small' or 'muted' variant. Don't use it for helper or error copy under a field; that is Text, referenced by the control's aria-describedby.",
		commonMistakes: [
			"Reaching for htmlFor — it does not exist in React Native; the association is nativeID on the label plus aria-labelledby on the control, which is the reverse of the web wiring",
			"Nesting the control inside the Label and expecting the association to happen implicitly — React Native does no implicit labelling, so the control ends up unnamed",
			"Relying on a placeholder instead of a label — the placeholder disappears once the user types, leaving the field unnamed for everyone",
			"Labelling a control that already has aria-label — the two compete, and which one wins differs between VoiceOver and TalkBack",
		],
		relatedComponents: ["native-input", "native-checkbox", "native-switch", "native-text"],
		accessibilityNotes:
			"Pairing is explicit: nativeID on the label, aria-labelledby on the control. Tapping the label focuses the control it names, which also enlarges the effective touch target for small controls like a checkbox. Keep label text short and specific — VoiceOver reads it immediately before the control's value and state. Use the disabled prop rather than a custom colour so the dimming matches the control.",
	},
});
