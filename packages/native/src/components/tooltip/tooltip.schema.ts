import { tooltipSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeTooltipSchema = deriveNativeSchema(tooltipSchema, {
	description:
		"A brief label anchored to a control. Touch has no hover, so the trigger toggles the bubble on tap and consumes that tap — a tooltip is a secondary affordance on native, never the only place a label lives.",
	removeProps: ["delayDuration", "disableHoverableContent", "open", "defaultOpen"],
	addProps: [
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
	],
	// The web tags carry "hover", the one interaction this component does not
	// have. Searching the native catalog for it should not land here.
	tags: ["tooltip", "hint", "label", "overlay", "native", "react-native"],
	dependencies: {
		npm: ["@rn-primitives/tooltip", "@rn-primitives/portal", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Naming an icon button",
			description: "The aria-label is what actually names the control; the tooltip only reveals it visually",
			code: '<Tooltip>\n  <TooltipTrigger asChild>\n    <Button variant="ghost" size="icon" aria-label="Archive">\n      <ArchiveIcon size={16} />\n    </Button>\n  </TooltipTrigger>\n  <TooltipContent>\n    <Text>Archive</Text>\n  </TooltipContent>\n</Tooltip>',
			composition: ["toolbar", "icon-only"],
		},
		{
			title: "Reacting to open state",
			description:
				"The bubble is uncontrolled on native — there is no open prop. Observe it with onOpenChange when something else needs to know.",
			code: '<Tooltip onOpenChange={setHintVisible}>\n  <TooltipTrigger asChild>\n    <Button variant="ghost" size="icon" aria-label="Filter">\n      <FilterIcon size={16} />\n    </Button>\n  </TooltipTrigger>\n  <TooltipContent>\n    <Text>Narrow the list</Text>\n  </TooltipContent>\n</Tooltip>',
			composition: ["onboarding"],
		},
	],
	ai: {
		whenToUse:
			"Use sparingly, to reveal the name of an icon-only control that does nothing else on tap — a legend button, a help affordance. Treat the bubble as a visual convenience layered on a real accessible name.",
		whenNotToUse:
			"Don't wrap a control that already acts on press: the trigger consumes the tap, so a Button inside a TooltipTrigger stops running its own handler. Don't use it to carry information the user needs. Don't use it for anything interactive (use Popover).",
		commonMistakes: [
			"Wrapping a working Button in TooltipTrigger — the tap opens the bubble instead of running the button's onPress, silently breaking the action",
			"Treating the tooltip as the control's name and omitting aria-label — a screen-reader user then hears an unnamed button, because the bubble is not the accessible name",
			"Expecting the web version's pointer-driven reveal: on a device the bubble toggles on tap, and there is no open prop to drive it from the parent",
			"Putting essential instructions in it — if the user must read it, it belongs on the screen",
			"Forgetting <PortalHost /> in the root layout, so the bubble never renders",
		],
		relatedComponents: ["native-button", "native-popover", "native-text"],
		accessibilityNotes:
			"A tooltip is never a substitute for a name: always give the trigger its own aria-label, and treat the bubble as a visual echo of it. The trigger reports its expanded state, so assistive tech knows the bubble opened. Because the tap toggles the bubble rather than acting, reserve this for controls whose only job is to explain themselves; anything actionable should carry a visible label instead. Positioning is measured on device, so the bubble anchors only once the trigger has laid out.",
	},
});
