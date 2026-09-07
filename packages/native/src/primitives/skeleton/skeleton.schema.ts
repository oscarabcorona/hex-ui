import { skeletonSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeSkeletonSchema = deriveNativeSchema(skeletonSchema, {
	description:
		"A pulsing placeholder that mimics the shape of content still loading. Animates with React Native's built-in Animated API, so it needs no native module.",
	addProps: [
		{
			name: "animated",
			type: "boolean",
			required: false,
			default: true,
			description: "Run the pulse. Turn it off for dense lists, or when the user prefers reduced motion.",
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Text placeholder",
			description: "Two lines standing in for a title and its body",
			code: '<View className="gap-2">\n  <Skeleton className="h-4 w-32" />\n  <Skeleton className="h-4 w-full" />\n</View>',
			composition: ["loading"],
		},
		{
			title: "List row",
			description: "Avatar plus two text lines, matching the real row so nothing shifts on load",
			code: '<View className="flex-row items-center gap-3" aria-busy>\n  <Skeleton className="h-10 w-10 rounded-full" />\n  <View className="flex-1 gap-2">\n    <Skeleton className="h-4 w-24" />\n    <Skeleton className="h-3 w-40" />\n  </View>\n</View>',
			composition: ["list-row", "loading"],
		},
		{
			title: "Respecting reduced motion",
			description: "Freeze the pulse when the OS reports a motion preference",
			code: "const reduceMotion = useReducedMotion();\n\n<Skeleton animated={!reduceMotion} className=\"h-4 w-32\" />",
			composition: ["loading", "accessibility"],
		},
	],
	ai: {
		whenToUse:
			"Use during async loads to show the shape of forthcoming content. Match the dimensions of the real content so nothing shifts when data arrives. Put aria-busy on the container that wraps the skeletons.",
		whenNotToUse:
			"Don't use for loads under ~200ms — a brief nothing reads better than a flash of placeholder. Don't use as a permanent empty state (render real empty-state copy). Don't use for a determinate operation whose completion you can measure (use Progress).",
		commonMistakes: [
			"Sizing the skeleton differently from the real content — the layout jumps when data arrives, which is the exact problem skeletons exist to prevent",
			"Leaving aria-busy off the loading container — VoiceOver and TalkBack read a screen of empty boxes with no indication anything is loading",
			"Rendering dozens of animating skeletons in a long list — each one drives its own Animated loop; pass animated={false} below the fold",
			"Forgetting to unmount skeletons once data arrives, leaving them pulsing under real content",
		],
		relatedComponents: ["native-progress", "native-avatar", "native-card"],
		accessibilityNotes:
			"The skeleton itself is decorative and announces nothing. Put aria-busy on the container so assistive tech reports that the region is loading, and render the real content in the same place once it arrives. Honour the OS reduce-motion setting by passing animated={false} — the pulse is the only motion in the component.",
	},
});
