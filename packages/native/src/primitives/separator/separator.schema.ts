import { separatorSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeSeparatorSchema = deriveNativeSchema(separatorSchema, {
	dependencies: {
		npm: ["@rn-primitives/separator", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Between sections",
			description: "A horizontal rule with vertical margin",
			code: '<View>\n  <Text variant="h3">Profile</Text>\n  <Separator className="my-4" />\n  <Text>Account details</Text>\n</View>',
			composition: ["layout"],
		},
		{
			title: "Vertical divider in a row",
			description: "Needs an explicit height — a vertical rule has no intrinsic size in flexbox",
			code: '<View className="flex-row items-center gap-2">\n  <Text variant="small">Draft</Text>\n  <Separator orientation="vertical" className="h-4" />\n  <Text variant="small">Edited 2h ago</Text>\n</View>',
			composition: ["metadata-row"],
		},
		{
			title: "Semantic break",
			description: "When the rule itself marks a boundary worth announcing",
			code: '<Separator decorative={false} className="my-6" />',
			composition: ["layout", "accessibility"],
		},
	],
	ai: {
		whenToUse:
			"Use to divide content groups: sections of a screen, groups in a settings list, items in a metadata row. Keep it decorative unless the rule is the only marker of a meaningful boundary.",
		whenNotToUse:
			"Don't use it for spacing — use gap or margin classes on the container. Don't put one between every row of a list; the row backgrounds already do that work and the rules turn into visual noise.",
		commonMistakes: [
			"Using a vertical separator without a height class — it collapses to nothing, because a 1pt-wide View in a flex row has no intrinsic height",
			"Reaching for a Separator to create space between elements — a rule is a visual statement, whereas gap-4 on the parent View is the actual fix",
			"Leaving decorative=true on a rule that marks a real thematic break, so screen-reader users lose the boundary entirely",
			"Putting a separator after the last item in a list, leaving a trailing rule against the container edge",
		],
		relatedComponents: ["native-card", "native-text"],
		accessibilityNotes:
			"Decorative by default, so assistive tech skips it and the content around it reads continuously. Pass decorative={false} to expose it as a separator element when the boundary is semantic. It draws in the border token, which is contrast-audited in light and dark, but never rely on the rule alone to convey grouping — a heading does that job for screen-reader users.",
	},
});
