import { buttonSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeButtonSchema = deriveNativeSchema(buttonSchema, {
	description:
		"A pressable action button with variants, sizes and a loading state. Labels are Text children that inherit the button's colour automatically.",
	removeProps: ["asChild"],
	addProps: [
		{
			name: "onPress",
			type: "function",
			required: false,
			description: "Called when the button is pressed (React Native Pressable). Not called while disabled or loading.",
		},
		{
			name: "onLongPress",
			type: "function",
			required: false,
			description: "Called after the press is held (React Native Pressable)",
		},
		{
			name: "hitSlop",
			type: "number",
			required: false,
			description: "Extra touchable area in points beyond the visible bounds — use on small or icon buttons",
		},
	],
	// Three web variants sold themselves on hover — "hover fill", "background
	// appears on hover", "underline on hover". A phone has no pointer, so those
	// descriptions describe a state the user can never reach. The sizes carry
	// over unchanged: they are NativeWind classes, which are real here.
	variants: [
		{
			name: "variant",
			description: "Visual style variants",
			values: [
				{
					value: "default",
					description: "Primary filled button for main actions",
					useWhen: "the single most important action on the screen — exactly one per view (Save, Submit, Continue)",
				},
				{
					value: "destructive",
					description: "Red filled button for dangerous or irreversible actions",
					useWhen: "the action cannot be undone without recreating data: Delete, Archive, Deactivate, Leave team",
				},
				{
					value: "outline",
					description: "Bordered button that fills while held down",
					useWhen: "tertiary actions on a flat surface; signals 'optional' next to a primary",
				},
				{
					value: "secondary",
					description: "Muted filled button for less prominent actions",
					useWhen: "the second-most-important action next to a primary call to action: Cancel, Save Draft, Skip",
				},
				{
					value: "ghost",
					description: "Transparent button whose background appears while held down",
					useWhen: "low-emphasis action inside a list, toolbar, or row where chrome should disappear at rest",
				},
				{
					value: "link",
					description: "Styled as a link with a permanent underline and no padding",
					useWhen: "an inline action inside flowing text, or a 'Learn more' affordance in an empty state",
				},
			],
			default: "default",
		},
		{
			name: "size",
			description: "Size variants",
			values: [
				{
					value: "default",
					description: "Standard size (h-10, px-4)",
					useWhen: "default everywhere; the only size you need on most surfaces",
				},
				{
					value: "sm",
					description: "Compact size (h-9, px-3)",
					useWhen: "buttons living inside a row or toolbar where vertical density matters — pair with hitSlop",
				},
				{
					value: "lg",
					description: "Large size (h-11, px-8, text-base)",
					useWhen: "the single hero action on an onboarding or paywall screen",
				},
				{
					value: "icon",
					description: "Square icon-only size (h-10, w-10)",
					useWhen: "icon-only actions (close, settings, more). Always pair with aria-label",
				},
			],
			default: "default",
		},
	],
	dependencies: {
		npm: ["class-variance-authority", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Basic usage",
			description: "A primary button with a Text label",
			code: "<Button onPress={save}>\n  <Text>Save</Text>\n</Button>",
			composition: ["form-action"],
		},
		{
			title: "Variants",
			description: "Every visual style; each label inherits the right colour with no extra props",
			code: '<View className="gap-2">\n  <Button><Text>Primary</Text></Button>\n  <Button variant="outline"><Text>Outline</Text></Button>\n  <Button variant="secondary"><Text>Secondary</Text></Button>\n  <Button variant="ghost"><Text>Ghost</Text></Button>\n  <Button variant="destructive"><Text>Delete</Text></Button>\n  <Button variant="link"><Text>Link</Text></Button>\n</View>',
			composition: ["showcase"],
		},
		{
			title: "Form action pair",
			description: "Primary submit plus secondary cancel — the universal end-of-form row",
			code: '<View className="flex-row justify-end gap-2">\n  <Button variant="secondary" onPress={cancel}>\n    <Text>Cancel</Text>\n  </Button>\n  <Button onPress={submit}>\n    <Text>Save changes</Text>\n  </Button>\n</View>',
			composition: ["form", "form-action"],
		},
		{
			title: "Loading state",
			description: "Shows a spinner in the label colour and blocks presses while an async action runs",
			code: "<Button loading={isSaving} onPress={save}>\n  <Text>Saving…</Text>\n</Button>",
			composition: ["form-action", "async"],
		},
		{
			title: "Icon button",
			description: "Square button holding only an icon; aria-label gives it a name",
			code: '<Button variant="outline" size="icon" aria-label="Settings" onPress={openSettings}>\n  <SettingsIcon size={16} />\n</Button>',
			composition: ["icon-only", "toolbar"],
		},
		{
			title: "Navigation with expo-router",
			description: "Navigate imperatively from onPress instead of wrapping a link element",
			code: '<Button variant="ghost" onPress={() => router.push("/login")}>\n  <Text>Log in</Text>\n</Button>',
			composition: ["navigation"],
		},
	],
	ai: {
		whenToUse:
			"Use for tappable actions: form submissions, confirmations, triggering operations. Wire the handler to onPress and put the label in a Text child. Use 'default' for the primary action, 'outline' or 'secondary' for less important actions, 'ghost' for toolbar-style actions.",
		whenNotToUse:
			"Don't use for navigation rows in a list (use a Pressable row or the router's Link). Don't use 'destructive' for non-dangerous actions. Don't use for toggling state (use Switch). Don't render a bare string child — wrap it in Text.",
		commonMistakes: [
			"Passing a bare string as the child — React Native throws 'Text strings must be rendered within a <Text> component'; wrap labels in Text",
			"Importing Text from react-native for the label instead of the Hex Text — the raw element ignores TextClassContext, so the label renders in default black on a coloured button",
			"Using <Button variant='destructive'> for recoverable actions like 'Reset filters' — reserve destructive for delete/archive/leave; use 'secondary' or 'ghost' for resets",
			"Using size='icon' without an aria-label — VoiceOver announces an unnamed button; always pair icon-only buttons with aria-label",
			"Handling disabled manually by checking a flag inside onPress — pass disabled (or loading) so the press is blocked and the state is announced",
		],
		antiPatterns: [
			{
				mistake: "Using <Button> to flip a boolean on/off (notifications, dark mode, airplane mode)",
				insteadUse: "native-switch",
				why: "Switch carries role=switch and the checked state to VoiceOver and TalkBack; a button announces only 'button' and loses the on/off semantic.",
			},
		],
		relatedComponents: ["native-text", "native-badge", "native-switch"],
		accessibilityNotes:
			"Renders a Pressable with role=\"button\"; disabled and loading set the disabled state so VoiceOver and TalkBack announce it, and loading also sets aria-busy. Icon-only buttons MUST have aria-label. The 40pt default height meets the touch-target minimum; add hitSlop on 'sm' buttons in dense rows. React Native draws no focus ring, so no ring classes are needed.",
	},
});
