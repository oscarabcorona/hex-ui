import { badgeSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeBadgeSchema = deriveNativeSchema(badgeSchema, {
	dependencies: {
		npm: ["class-variance-authority", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Basic usage",
			description: "A default badge with a Text label",
			code: "<Badge>\n  <Text>New</Text>\n</Badge>",
			composition: ["status"],
		},
		{
			title: "Variants",
			description: "Each variant colours its label automatically",
			code: '<View className="flex-row flex-wrap gap-2">\n  <Badge><Text>Default</Text></Badge>\n  <Badge variant="secondary"><Text>Beta</Text></Badge>\n  <Badge variant="destructive"><Text>Failed</Text></Badge>\n  <Badge variant="outline"><Text>Draft</Text></Badge>\n</View>',
			composition: ["showcase"],
		},
		{
			title: "Next to a heading",
			description: "Marking a section as beta",
			code: '<View className="flex-row items-center gap-2">\n  <Text variant="h3">API Keys</Text>\n  <Badge variant="secondary"><Text>Beta</Text></Badge>\n</View>',
			composition: ["screen-header"],
		},
		{
			title: "Live status",
			description:
				"A badge whose text changes needs both accessible and role=\"status\" — the role alone is not enough on React Native, because a plain View is not an accessibility element and is never announced",
			code: '<Badge accessible role="status" variant={job.failed ? "destructive" : "secondary"}>\n  <Text>{job.state}</Text>\n</Badge>',
			composition: ["status", "live"],
		},
	],
	ai: {
		whenToUse:
			"Use for status indicators, tags, counts and categories. Place next to headings, in list rows, or inside a Card header. Put the label in a Text child so it picks up the variant colour.",
		whenNotToUse:
			"Don't use for tappable actions (use Button, which gives a real touch target). Don't use for long text — a badge is a chip, not a paragraph. Don't use as the only signal of an error state.",
		commonMistakes: [
			"Passing a bare string child — React Native throws 'Text strings must be rendered within a <Text> component'; wrap the label in Text",
			"Wrapping a Badge in a Pressable to make it tappable — the 20pt height is far below the touch-target minimum; use a Button with size='sm' instead",
			"Passing role='status' without accessible — unlike the DOM, a React Native View with a role but no accessible flag is not an accessibility element, so VoiceOver and TalkBack never announce the change; pass both",
			"Using variant='destructive' for a neutral count — reserve it for genuine failure states",
		],
		relatedComponents: ["native-text", "native-button", "native-card"],
		accessibilityNotes:
			"Decorative by default: the label is read as ordinary text in reading order. For a badge whose content updates, pass both accessible and role=\"status\" — React Native only exposes a View to assistive tech when accessible is set, so the role by itself announces nothing. Colour alone never carries the meaning; the label text always states it. Every variant's label token is contrast-audited against its background in light and dark.",
	},
});
