import { tabsSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeTabsSchema = deriveNativeSchema(tabsSchema, {
	description:
		"A tabbed panel switcher. Controlled only on native — pass value and onValueChange — with each trigger matched to a panel by a shared value.",
	removeProps: ["defaultValue"],
	dependencies: {
		npm: ["@rn-primitives/tabs", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Two panels",
			description: "Triggers and content matched by value",
			code: '<Tabs value={tab} onValueChange={setTab}>\n  <TabsList>\n    <TabsTrigger value="account"><Text>Account</Text></TabsTrigger>\n    <TabsTrigger value="billing"><Text>Billing</Text></TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">\n    <Text>Account settings</Text>\n  </TabsContent>\n  <TabsContent value="billing">\n    <Text>Billing settings</Text>\n  </TabsContent>\n</Tabs>',
			composition: ["navigation", "panel"],
		},
		{
			title: "Inside a card",
			description: "Tabs scoped to one surface rather than the whole screen",
			code: '<Card>\n  <CardContent className="pt-6">\n    <Tabs value={range} onValueChange={setRange}>\n      <TabsList>\n        <TabsTrigger value="7d"><Text>7 days</Text></TabsTrigger>\n        <TabsTrigger value="30d"><Text>30 days</Text></TabsTrigger>\n      </TabsList>\n      <TabsContent value="7d"><Chart range="7d" /></TabsContent>\n      <TabsContent value="30d"><Chart range="30d" /></TabsContent>\n    </Tabs>\n  </CardContent>\n</Card>',
			composition: ["card", "panel"],
		},
	],
	ai: {
		whenToUse:
			"Use to switch between a small number of sibling panels inside one screen — two to four, all of comparable importance. Keep the state in the parent and pass value plus onValueChange.",
		whenNotToUse:
			"Don't use for navigating between screens — that is the router's job, and a phone user expects a bottom tab bar or a stack push. Don't use for more than about four tabs; the row gets too cramped to hit. Don't use to reveal a single optional section (that is a collapsible).",
		commonMistakes: [
			"Rendering it uncontrolled — the native primitive needs value and onValueChange, and defaultValue does not exist here, so the tabs never change",
			"Reaching for the orientation, dir or activationMode props from the web component — all three are web-only on the primitive and do nothing on a device",
			"Using tabs as app-level navigation instead of the router's tab navigator, which loses the back stack, deep links and the native tab bar",
			"Putting a scrolling list inside TabsContent without a fixed height, so the panel and the outer scroll view fight over the gesture",
			"Passing a bare string as a trigger's child instead of wrapping it in Text",
		],
		relatedComponents: ["native-text", "native-card", "native-separator"],
		accessibilityNotes:
			"Each trigger is a Pressable whose label comes from its Text child; the selected one is styled with the foreground token while the rest stay muted, so state is visible rather than colour-coded alone. Only the matching panel is mounted, which keeps the accessibility tree honest about what is on screen. Triggers stretch to fill the row, so each stays a comfortable touch target; keep labels to one or two words so they do not truncate.",
	},
});
