import { textareaSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeTextareaSchema = deriveNativeSchema(textareaSchema, {
	description:
		"A multi-line text field. Reports edits through onChangeText, and grows from a 80pt minimum rather than using a rows attribute.",
	removeProps: ["rows", "onChange", "disabled"],
	addProps: [
		{
			name: "onChangeText",
			type: "function",
			required: false,
			description: "Called with the new string on every edit. Replaces the web onChange.",
		},
		{
			name: "numberOfLines",
			type: "number",
			required: false,
			description: "Preferred visible line count. Replaces the web rows attribute; advisory on iOS, honoured on Android.",
		},
		{
			name: "editable",
			type: "boolean",
			required: false,
			default: true,
			description: "Set false to make the field read-only and dimmed. Replaces the web disabled prop.",
		},
		{
			name: "submitBehavior",
			type: "enum",
			required: false,
			default: "newline",
			description: "What Return does. Keep the newline default for prose; use \"submit\" only for a single-line-style composer.",
			enumValues: ["newline", "submit", "blurAndSubmit"],
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Labelled notes field",
			description: "Four visible lines with the label wired for assistive tech",
			code: '<View className="gap-1.5">\n  <Label nativeID="notes">Notes</Label>\n  <Textarea\n    aria-labelledby="notes"\n    value={notes}\n    onChangeText={setNotes}\n    numberOfLines={4}\n    placeholder="Anything we should know?"\n  />\n</View>',
			composition: ["form", "field"],
		},
		{
			title: "Character counter",
			description: "Cap the length and show the remaining count",
			code: '<View className="gap-1.5">\n  <Textarea\n    aria-labelledby="bio"\n    value={bio}\n    onChangeText={setBio}\n    maxLength={280}\n  />\n  <Text variant="muted" className="self-end">{280 - bio.length} left</Text>\n</View>',
			composition: ["form", "validation"],
		},
		{
			title: "Read-only",
			description: "editable={false} is the React Native equivalent of disabled",
			code: '<Textarea aria-labelledby="terms" editable={false} value={termsText} />',
			composition: ["form", "disabled"],
		},
	],
	ai: {
		whenToUse:
			"Use for multi-line entry: notes, descriptions, feedback, message bodies. Pair with a Label, and set numberOfLines so the field opens at a sensible height.",
		whenNotToUse:
			"Don't use for single-line values (use Input, which raises the right keyboard and submits on Return). Don't use for rich text. Don't use it as a chat composer on its own — that needs send handling and keyboard avoidance.",
		commonMistakes: [
			"Wiring onChange and reading event.target.value — React Native hands the string to onChangeText, so the web handler never fires",
			"Leaving textAlignVertical unset when overriding the height — on iOS the text then floats in the vertical centre of the box instead of starting at the top",
			"Setting submitBehavior=\"submit\" on a prose field, which turns Return into a submit and leaves the user unable to type a paragraph",
			"Placing it low in a scroll view without a KeyboardAvoidingView, so the keyboard covers the field the moment it is focused",
		],
		relatedComponents: ["native-input", "native-label", "native-text"],
		accessibilityNotes:
			"Name it by pairing a Label's nativeID with aria-labelledby, and attach helper or error copy with aria-describedby. The 80pt minimum height gives a comfortable touch target. Keyboard avoidance matters more here than for a single-line input, because a multi-line field is usually further down a form: wrap the form in a KeyboardAvoidingView so the field stays visible while typing.",
	},
});
