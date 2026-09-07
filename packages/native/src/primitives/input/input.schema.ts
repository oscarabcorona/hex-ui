import { inputSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeInputSchema = deriveNativeSchema(inputSchema, {
	description:
		"A single-line text field. Reports edits through onChangeText with the string itself, and picks its keyboard through keyboardType rather than an input type.",
	removeProps: ["type", "onChange", "disabled"],
	addProps: [
		{
			name: "onChangeText",
			type: "function",
			required: false,
			description: "Called with the new string on every edit. Replaces the web onChange — there is no event object.",
		},
		{
			name: "keyboardType",
			type: "enum",
			required: false,
			default: "default",
			description: "Which on-screen keyboard to raise. Replaces the web input type for numeric, email and phone entry.",
			enumValues: ["default", "number-pad", "decimal-pad", "numeric", "email-address", "phone-pad", "url"],
		},
		{
			name: "secureTextEntry",
			type: "boolean",
			required: false,
			default: false,
			description: "Mask the text for password entry. Replaces type=\"password\".",
		},
		{
			name: "editable",
			type: "boolean",
			required: false,
			default: true,
			description: "Set false to make the field read-only and dimmed. Replaces the web disabled prop.",
		},
		{
			name: "autoCapitalize",
			type: "enum",
			required: false,
			default: "sentences",
			description: "Autocapitalisation behaviour. Set to \"none\" for emails, usernames and passwords.",
			enumValues: ["none", "sentences", "words", "characters"],
		},
		{
			name: "autoComplete",
			type: "string",
			required: false,
			description: "Hint for the OS password manager and autofill, e.g. \"email\", \"password\", \"one-time-code\".",
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Labelled email field",
			description: "The keyboard, capitalisation and autofill hints all matter on a phone",
			code: '<View className="gap-1.5">\n  <Label nativeID="email">Email</Label>\n  <Input\n    aria-labelledby="email"\n    value={email}\n    onChangeText={setEmail}\n    keyboardType="email-address"\n    autoCapitalize="none"\n    autoComplete="email"\n    placeholder="you@example.com"\n  />\n</View>',
			composition: ["form", "field"],
		},
		{
			title: "Password field",
			description: "secureTextEntry replaces the web password type",
			code: '<Input\n  aria-labelledby="password"\n  secureTextEntry\n  autoCapitalize="none"\n  autoComplete="password"\n  value={password}\n  onChangeText={setPassword}\n/>',
			composition: ["form", "auth"],
		},
		{
			title: "Read-only field",
			description: "editable={false} is the React Native equivalent of disabled",
			code: '<Input aria-labelledby="plan" editable={false} value="Enterprise" />',
			composition: ["form", "disabled"],
		},
		{
			title: "Field with an error message",
			description: "Point aria-describedby at the message so it is announced with the field",
			code: '<View className="gap-1.5">\n  <Label nativeID="email">Email</Label>\n  <Input\n    aria-labelledby="email"\n    aria-describedby="email-error"\n    aria-invalid={!!error}\n    className={error ? "border-destructive" : undefined}\n    value={email}\n    onChangeText={setEmail}\n  />\n  {error ? (\n    <Text nativeID="email-error" variant="small" className="text-destructive">\n      {error}\n    </Text>\n  ) : null}\n</View>',
			composition: ["form", "validation"],
		},
	],
	ai: {
		whenToUse:
			"Use for single-line entry: names, emails, passwords, search, numbers. Always pair with a Label, and set keyboardType, autoCapitalize and autoComplete so the phone raises the right keyboard and autofill works.",
		whenNotToUse:
			"Don't use for multi-line text (use Textarea). Don't use for choosing among fixed options (use Select). Don't use it as a search trigger that opens another screen; render a Pressable row that looks like a field instead.",
		commonMistakes: [
			"Wiring onChange and reading event.target.value — React Native passes the string straight to onChangeText, so the web handler shape silently never fires",
			"Passing disabled — TextInput has no such prop; the field stays fully editable. Use editable={false}",
			"Using type=\"email\" or type=\"number\" — those are DOM attributes; on native the keyboard comes from keyboardType and masking from secureTextEntry",
			"Leaving autoCapitalize at its default on an email or username field, so the phone capitalises the first letter and the value is wrong",
			"Relying on the placeholder as the field's name — it vanishes on first keystroke and is not a reliable accessible name",
		],
		relatedComponents: ["native-label", "native-text", "native-button"],
		accessibilityNotes:
			"Name the field by pairing a Label's nativeID with aria-labelledby here; a placeholder is not a name. Attach helper and error copy with aria-describedby and set aria-invalid when validation fails, so VoiceOver reads the problem with the field. The 40pt height meets the touch-target minimum. Keep the field visible above the keyboard by wrapping the form in a KeyboardAvoidingView — an input hidden behind the keyboard is unusable regardless of its markup.",
	},
});
