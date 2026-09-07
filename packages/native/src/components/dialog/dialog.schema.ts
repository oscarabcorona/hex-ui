import { dialogSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeDialogSchema = deriveNativeSchema(dialogSchema, {
	description:
		"A modal surface layered over the screen. Renders through a PortalHost that the app mounts once in its root layout.",
	removeProps: ["modal"],
	addProps: [
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/dialog", "@rn-primitives/portal", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context", "primitives/text/text"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Controlled dialog",
			description: "Open state held by the parent, with a titled panel",
			code: '<Dialog open={open} onOpenChange={setOpen}>\n  <DialogContent>\n    <DialogTitle>Delete project</DialogTitle>\n    <DialogDescription>This cannot be undone.</DialogDescription>\n    <View className="flex-row justify-end gap-2">\n      <Button variant="secondary" onPress={() => setOpen(false)}>\n        <Text>Cancel</Text>\n      </Button>\n      <Button variant="destructive" onPress={remove}>\n        <Text>Delete</Text>\n      </Button>\n    </View>\n  </DialogContent>\n</Dialog>',
			composition: ["overlay", "confirm"],
		},
		{
			title: "With a trigger",
			description: "Let the dialog own its state via a trigger",
			code: '<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outline">\n      <Text>Rename</Text>\n    </Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Rename project</DialogTitle>\n    <Input aria-labelledby="rename" value={name} onChangeText={setName} />\n  </DialogContent>\n</Dialog>',
			composition: ["overlay", "form"],
		},
		{
			title: "Required app setup",
			description: "Mount the portal host once, in the root layout",
			code: 'import { PortalHost } from "@rn-primitives/portal";\n\nexport default function RootLayout() {\n  return (\n    <>\n      <Stack />\n      <PortalHost />\n    </>\n  );\n}',
			composition: ["setup"],
		},
	],
	ai: {
		// The web schema steers long flows at Stepper and side panels at
		// Drawer. Neither has a native port: on a phone both collapse into a
		// bottom sheet or a pushed screen, so the anti-patterns are restated
		// rather than inherited with slugs that resolve to nothing.
		antiPatterns: [
			{
				mistake: "Using a centred Dialog for a menu or a list of options",
				insteadUse: "native-bottom-sheet",
				why: "A panel in the middle of the screen is out of thumb reach. A sheet rises from the bottom edge, which is the platform idiom for choosing among options.",
			},
			{
				mistake: "Putting a multi-step flow inside a Dialog",
				insteadUse: "native-bottom-sheet",
				why: "A modal traps the back gesture. Use a sheet for one short step, or push a screen so the user keeps the navigation stack.",
			},
		],
		whenToUse:
			"Use for a focused task or confirmation that must interrupt: renaming, confirming a destructive action, a short form. Always give it a DialogTitle.",
		whenNotToUse:
			"Don't use for a choice among several options on a phone — a bottom sheet or an action sheet is the platform idiom. Don't use for transient feedback (that is a toast). Don't stack a dialog on a dialog. Don't use it for a long form; push a screen instead.",
		commonMistakes: [
			"Forgetting <PortalHost /> in the root layout — the dialog mounts but renders nothing, with no error to explain why",
			"Omitting DialogTitle, which leaves the modal unnamed when it opens so a screen-reader user hears only the body text",
			"Reaching for the modal prop from the web component — on native the overlay is always modal and the prop does nothing",
			"Relying on a hardware back press being handled for you on Android without wiring onOpenChange, so the dialog and the navigation stack disagree about what is open",
			"Putting a bare string inside a dialog instead of a Text element",
		],
		relatedComponents: ["native-button", "native-text", "native-input"],
		accessibilityNotes:
			"The panel is announced when it opens, and the title is what names it — always include a DialogTitle, and put the consequence in DialogDescription so both are read together. Tapping the scrim dismisses by default, but a scrim tap is not discoverable to a screen-reader user: always include a visible Cancel or Close control too. Give destructive confirmations a clearly labelled non-destructive escape.",
	},
});
