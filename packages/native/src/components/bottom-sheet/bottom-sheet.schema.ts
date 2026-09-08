import type { ComponentSchemaInput } from "@hex-core/registry";

/**
 * Native-only: there is no `bottom-sheet` in the web catalog to derive from.
 * On a desktop the same job is split across DropdownMenu, Popover and Dialog;
 * on a phone it collapses into one component, because a panel anchored near
 * the top of the screen is out of thumb reach.
 */
export const nativeBottomSheetSchema: ComponentSchemaInput = {
	name: "native-bottom-sheet",
	platform: "native",
	displayName: "BottomSheet",
	description:
		"A modal panel that rises from the bottom edge. The React Native answer to a dropdown menu, an option list, or a short form — placed where a thumb can reach it.",
	category: "component",
	subcategory: "overlay",
	props: [
		{
			name: "open",
			type: "boolean",
			required: false,
			description: "Controlled open state. Pair with onOpenChange.",
		},
		{
			name: "defaultOpen",
			type: "boolean",
			required: false,
			default: false,
			description: "Initial open state when the sheet manages itself",
		},
		{
			name: "onOpenChange",
			type: "function",
			required: false,
			description: "Called with the next open state, including when the scrim is tapped",
		},
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
		{
			name: "className",
			type: "string",
			required: false,
			description: "Additional NativeWind classes on the sheet panel",
		},
	],
	variants: [],
	slots: [
		{
			name: "children",
			description: "The sheet's content — a title, then options, a form, or actions",
			required: true,
			acceptedTypes: ["ReactNode"],
		},
	],
	dependencies: {
		npm: [
			"@rn-primitives/dialog",
			"@rn-primitives/portal",
			"react-native-safe-area-context",
			"clsx",
			"tailwind-merge",
		],
		internal: ["lib/utils", "lib/animated"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Sort options",
			description: "The native shape of what a web app would put in a dropdown menu",
			code: '<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheetContent>\n    <BottomSheetTitle>Sort by</BottomSheetTitle>\n    <RadioGroup value={sort} onValueChange={setSort}>\n      <View className="flex-row items-center gap-2">\n        <RadioGroupItem value="newest" aria-labelledby="sort-newest" />\n        <Label nativeID="sort-newest">Newest first</Label>\n      </View>\n      <View className="flex-row items-center gap-2">\n        <RadioGroupItem value="oldest" aria-labelledby="sort-oldest" />\n        <Label nativeID="sort-oldest">Oldest first</Label>\n      </View>\n    </RadioGroup>\n  </BottomSheetContent>\n</BottomSheet>',
			composition: ["overlay", "menu"],
		},
		{
			title: "Short form",
			description: "A couple of fields plus a confirm, without pushing a screen",
			code: '<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheetContent>\n    <BottomSheetTitle>Add a note</BottomSheetTitle>\n    <Textarea aria-labelledby="note" value={note} onChangeText={setNote} />\n    <Button onPress={save}>\n      <Text>Save</Text>\n    </Button>\n  </BottomSheetContent>\n</BottomSheet>',
			composition: ["overlay", "form"],
		},
		{
			title: "With an explicit close",
			description: "A visible dismiss, which the scrim alone does not give assistive tech",
			code: '<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheetContent>\n    <BottomSheetTitle>Share</BottomSheetTitle>\n    <BottomSheetDescription>Anyone with the link can view.</BottomSheetDescription>\n    <BottomSheetClose asChild>\n      <Button variant="secondary">\n        <Text>Close</Text>\n      </Button>\n    </BottomSheetClose>\n  </BottomSheetContent>\n</BottomSheet>',
			composition: ["overlay", "share"],
		},
	],
	ai: {
		whenToUse:
			"Use for a menu, an option list, or a short form on a phone — the native replacement for a dropdown or popover. Reach for it whenever a web design would open a panel anchored to a control near the top of the screen.",
		whenNotToUse:
			"Don't use it to confirm something irreversible (use AlertDialog, which will not dismiss on a scrim tap). Don't use it for a long or multi-step flow; push a screen so the user keeps the back gesture. Don't stack a sheet on a sheet.",
		commonMistakes: [
			"Forgetting <PortalHost /> in the root layout — the sheet mounts but renders nothing",
			"Omitting the safe-area padding when overriding the panel's className, so the last action sits under the home indicator and cannot be tapped",
			"Using a sheet for a destructive confirmation, where a scrim tap dismisses the question instead of answering it",
			"Putting a tall scrolling list in it without bounding the height, so the sheet covers the screen and the scrim can no longer be reached to dismiss",
			"Omitting BottomSheetTitle, which leaves the sheet unnamed when it opens",
		],
		relatedComponents: ["native-dialog", "native-radio-group", "native-button", "native-text"],
		accessibilityNotes:
			"The panel is announced when it opens and the title names it, so always include a BottomSheetTitle. The sheet pads its bottom past the safe-area inset, keeping the last control clear of the home indicator. A scrim tap dismisses, but that is not discoverable to a screen-reader user — include a visible close or confirm control for anything longer than a short option list. Keep the panel under about half the screen so the scrim stays reachable.",
	},
	tags: ["bottom-sheet", "sheet", "overlay", "menu", "modal", "native", "react-native"],
};
