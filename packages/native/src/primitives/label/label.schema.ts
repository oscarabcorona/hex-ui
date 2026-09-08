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
			description: "Dim the label to match a disabled control, and stop it responding to taps",
		},
		{
			name: "onPress",
			type: "function",
			required: false,
			description:
				"Called when the caption's row is tapped. aria-labelledby carries the name only, not the press, so wire this to the control's own handler to make the label a second touch target.",
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
			title: "Label as a second touch target",
			description: "The pairing names the checkbox; onPress is what makes the caption tappable",
			code: '<View className="flex-row items-center gap-2">\n  <Checkbox\n    aria-labelledby="terms"\n    checked={agreed}\n    onCheckedChange={setAgreed}\n  />\n  <Label nativeID="terms" onPress={() => setAgreed(!agreed)}>\n    I agree to the terms\n  </Label>\n</View>',
			composition: ["form", "field"],
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
			"Assuming aria-labelledby forwards taps the way htmlFor does in a browser — it names the control and nothing more; pass onPress to make the caption tappable",
		],
		relatedComponents: ["native-input", "native-checkbox", "native-switch", "native-text"],
		accessibilityNotes:
			"Pairing is explicit: nativeID on the label, aria-labelledby on the control, and it carries the accessible name only. A tap on the caption does not reach the control the way it does in a browser, so pass onPress calling the control's own handler — that is what enlarges the effective touch target for something as small as a checkbox. Keep label text short and specific — VoiceOver reads it immediately before the control's value and state. Use the disabled prop rather than a custom colour so the dimming matches the control.",
	},
});
