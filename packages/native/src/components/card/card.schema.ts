import { cardSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeCardSchema = deriveNativeSchema(cardSchema, {
	// The web description advertises "hover effects", which a touch surface
	// cannot deliver. Native cards are passive by default and take their
	// interactivity from a Pressable wrapped around them.
	description:
		"A container with header, content and footer sections on a raised surface. Passive by default — wrap it in a Pressable to make the whole card one target.",
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context", "primitives/text/text"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Basic card",
			description: "Header, body and footer composed from the slots",
			code: '<Card>\n  <CardHeader>\n    <CardTitle>Storage</CardTitle>\n    <CardDescription>94% of 10 GB used</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <Progress value={94} aria-label="Storage used" />\n  </CardContent>\n  <CardFooter className="justify-end">\n    <Button variant="outline" onPress={upgrade}>\n      <Text>Upgrade</Text>\n    </Button>\n  </CardFooter>\n</Card>',
			composition: ["surface", "settings"],
		},
		{
			title: "Header only",
			description: "Every slot is optional — omit what the card does not need",
			code: '<Card>\n  <CardHeader>\n    <CardTitle>No devices yet</CardTitle>\n    <CardDescription>Pair a device to see it here.</CardDescription>\n  </CardHeader>\n</Card>',
			composition: ["surface", "empty-state"],
		},
		{
			title: "Tappable card",
			description: "Wrap the whole card in a Pressable and name the action",
			code: '<Pressable\n  role="button"\n  aria-label="Open billing settings"\n  onPress={() => router.push("/billing")}\n>\n  <Card>\n    <CardHeader>\n      <CardTitle>Billing</CardTitle>\n      <CardDescription>Visa ending 4242</CardDescription>\n    </CardHeader>\n  </Card>\n</Pressable>',
			composition: ["surface", "navigation"],
		},
	],
	ai: {
		// The web schema also steers layout-only uses at Container and Stack.
		// Those are web layout primitives with no native counterpart — a View
		// with gap classes is the native answer — so the nesting anti-pattern
		// is kept and the layout ones are dropped rather than left dangling.
		antiPatterns: [
			{
				mistake: "Nesting a Card inside a Card to group sub-sections",
				insteadUse: "native-separator",
				why: "Two raised surfaces inside each other muddle the elevation model. Divide sections inside one Card with a Separator, or split into sibling Cards.",
			},
		],
		whenToUse:
			"Use to group related content on a surface: a settings group, a summary panel, an item in a feed. Compose the slots rather than passing text through props.",
		whenNotToUse:
			"Don't nest a card inside a card — the borders stack and the hierarchy stops reading. Don't use one per row in a long list where a plain row with a separator is lighter. Don't use it as a modal surface (use Dialog).",
		commonMistakes: [
			"Putting horizontal padding on the Card itself — each slot already pads to 24pt, so a padded root double-pads the content and the border sits away from the edge",
			"Placing a bare string directly in CardContent instead of a Text element — React Native throws",
			"Making a card tappable by putting a Pressable inside it rather than around it, so only part of the surface responds and the accessible name covers a fragment",
			"Using CardTitle for a screen title — it renders as a fourth-level heading, which flattens the hierarchy when it stands in for the top-level one",
		],
		relatedComponents: ["native-text", "native-button", "native-separator", "native-badge"],
		accessibilityNotes:
			"CardTitle announces as a heading, so screen-reader users can jump between cards; keep exactly one title per card. The card is a passive container by default. To make it tappable, wrap the whole thing in a Pressable with role=\"button\" and an aria-label describing the destination, so the entire surface is one target rather than several fragments. The card and card-foreground tokens are contrast-audited in light and dark.",
	},
});
