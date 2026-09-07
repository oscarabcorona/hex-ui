import { popoverSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativePopoverSchema = deriveNativeSchema(popoverSchema, {
	description:
		"A small panel anchored to the control that opened it. Renders through a PortalHost, and closes on an outside tap.",
	addProps: [
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/popover", "@rn-primitives/portal", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Anchored panel",
			description: "A short filter panel hung off a button",
			code: '<Popover>\n  <PopoverTrigger asChild>\n    <Button variant="outline"><Text>Filters</Text></Button>\n  </PopoverTrigger>\n  <PopoverContent>\n    <Text variant="small">Sort</Text>\n    <RadioGroup value={sort} onValueChange={setSort}>\n      <View className="flex-row items-center gap-2">\n        <RadioGroupItem value="new" aria-labelledby="sort-new" />\n        <Label nativeID="sort-new">Newest</Label>\n      </View>\n    </RadioGroup>\n  </PopoverContent>\n</Popover>',
			composition: ["overlay", "filter"],
		},
		{
			title: "Reacting to open state",
			description: "Observe the panel with onOpenChange when something else needs to know",
			code: '<Popover onOpenChange={setFiltersOpen}>\n  <PopoverTrigger asChild>\n    <Button variant="ghost" aria-label="Help"><Text>?</Text></Button>\n  </PopoverTrigger>\n  <PopoverContent>\n    <Text>Rates refresh every 15 minutes.</Text>\n  </PopoverContent>\n</Popover>',
			composition: ["overlay", "help"],
		},
	],
	ai: {
		whenToUse:
			"Use for a small amount of secondary content anchored to a control: a short filter set, a help note, a compact form of two or three fields. Keep it to what fits without scrolling.",
		whenNotToUse:
			"Don't use for a list of choices on a phone — a sheet or Select is easier to reach with a thumb. Don't use for anything that needs scrolling. Don't use it as a tooltip for plain text hints. Don't use it to hold a primary flow; push a screen.",
		commonMistakes: [
			"Forgetting <PortalHost /> in the root layout — the panel mounts but renders nothing",
			"Putting a scrolling list inside it, which collides with the outside-tap scrim and traps the gesture",
			"Anchoring it to a control near the bottom of the screen, where the panel opens under the thumb or off-screen — a sheet is the better shape there",
			"Relying on the outside tap alone to dismiss it, which is invisible to a screen-reader user; include a close control for anything with more than a line of text",
		],
		relatedComponents: ["native-button", "native-text", "native-dialog"],
		accessibilityNotes:
			"The trigger keeps its own accessible name and reports its expanded state, so assistive tech knows the panel opened. Dismissal by outside tap is not discoverable, so anything beyond a single line should carry an explicit close control. The panel anchors to a measured trigger position, so it appears only after the trigger has laid out. Keep the panel short: content that scrolls inside a popover is hard to reach and hard to escape on a touch device.",
	},
});
