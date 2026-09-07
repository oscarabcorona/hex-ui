import { switchSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeSwitchSchema = deriveNativeSchema(switchSchema, {
	description:
		"An instant-effect on/off control, the standard idiom for a settings row on a phone. Controlled only — pass checked and onCheckedChange together.",
	removeProps: ["defaultChecked"],
	dependencies: {
		npm: ["@rn-primitives/switch", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Settings row",
			description: "Label on the left, switch on the right — the platform convention",
			code: '<View className="flex-row items-center justify-between py-2">\n  <Label nativeID="notifications">Push notifications</Label>\n  <Switch\n    aria-labelledby="notifications"\n    checked={enabled}\n    onCheckedChange={setEnabled}\n  />\n</View>',
			composition: ["settings-row"],
		},
		{
			title: "With a description",
			description: "Explain the consequence under the label, and announce it with the control",
			code: '<View className="flex-row items-start justify-between gap-4 py-2">\n  <View className="flex-1 gap-1">\n    <Label nativeID="sync">Background sync</Label>\n    <Text nativeID="sync-hint" variant="muted">Uses mobile data when Wi-Fi is unavailable.</Text>\n  </View>\n  <Switch\n    aria-labelledby="sync"\n    aria-describedby="sync-hint"\n    checked={sync}\n    onCheckedChange={setSync}\n  />\n</View>',
			composition: ["settings-row", "description"],
		},
		{
			title: "Persisting immediately",
			description: "The change takes effect on toggle; there is no save button",
			code: '<Switch\n  aria-labelledby="airplane"\n  checked={airplane}\n  onCheckedChange={(next) => {\n    setAirplane(next);\n    void savePreference("airplane", next);\n  }}\n/>',
			composition: ["settings-row", "async"],
		},
	],
	ai: {
		whenToUse:
			"Use for settings that take effect the moment they are flipped: notifications, dark mode, background sync, airplane mode. On a phone this is the expected control for a settings row.",
		whenNotToUse:
			"Don't use for a value submitted later with a form (use Checkbox). Don't use for mutually exclusive options (use RadioGroup). Don't use it to filter a list.",
		commonMistakes: [
			"Rendering it uncontrolled — the native primitive needs both checked and onCheckedChange, so without them the thumb never moves",
			"Passing defaultChecked as on the web — there is no uncontrolled mode; seed the parent state instead",
			"Pairing it with a Save button — a switch means the change already happened; if the value needs saving, use a Checkbox",
			"Leaving the row without a Label and relying on nearby text — the switch then announces only its on/off state with no name",
			"Reverting the value silently when an async persist fails, with nothing shown to the user",
		],
		// The web schema also steers mutually-exclusive choices at RadioGroup.
		// That port lands with the overlay set, and the quality gate rejects an
		// `insteadUse` slug that does not resolve, so the entry is restored then.
		antiPatterns: [
			{
				mistake: "Using a Switch for a value the user submits later with the rest of a form",
				insteadUse: "native-checkbox",
				why: "A switch promises the change already took effect. A checkbox is the control for a value that is staged until submit.",
			},
		],
		relatedComponents: ["native-label", "native-checkbox", "native-text"],
		accessibilityNotes:
			"The primitive sets role=\"switch\" and reports the on/off state, so VoiceOver and TalkBack announce name and state together. Name it by pairing a Label's nativeID with aria-labelledby, and attach any explanatory line with aria-describedby. Tapping the label toggles the switch, which matters because the control is only 44pt wide. The track colour changes with state, but the announced state is what carries the meaning, never the colour alone.",
	},
});
