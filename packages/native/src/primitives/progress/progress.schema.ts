import { progressSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeProgressSchema = deriveNativeSchema(progressSchema, {
	description:
		"A determinate progress bar for measurable work. Animates its fill with React Native's built-in Animated API, so it pulls in no native module.",
	addProps: [
		{
			name: "indicatorClassName",
			type: "string",
			required: false,
			description: "Classes for the filled portion, e.g. to recolour it for a warning threshold",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/progress", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Upload progress",
			description: "A named bar with a visible percentage beside it",
			code: '<View className="gap-1.5">\n  <View className="flex-row justify-between">\n    <Text variant="small">Uploading</Text>\n    <Text variant="muted">{percent}%</Text>\n  </View>\n  <Progress value={percent} aria-label="Upload progress" />\n</View>',
			composition: ["feedback", "async"],
		},
		{
			title: "Multi-step form",
			description: "Steps mapped onto the bar with an explicit max",
			code: '<Progress value={step} max={totalSteps} aria-label={`Step ${step} of ${totalSteps}`} />',
			composition: ["form", "wizard"],
		},
		{
			title: "Threshold colour",
			description: "Recolour the fill without touching the track",
			code: '<Progress\n  value={usage}\n  aria-label="Storage used"\n  indicatorClassName={usage > 90 ? "bg-destructive" : undefined}\n/>',
			composition: ["feedback", "threshold"],
		},
	],
	ai: {
		whenToUse:
			"Use where completion is measurable: uploads, downloads, batch jobs, step counters. Give it an aria-label, and show the number next to it when precision matters.",
		whenNotToUse:
			"Don't use for waits of unknown length (use an ActivityIndicator or Skeleton). Don't use for a value that is a measurement rather than progress toward completion — that is a chart. Don't animate it from a high-frequency event without throttling.",
		commonMistakes: [
			"Leaving off aria-label — the bar announces a percentage with no indication of what is progressing",
			"Rendering one per row in a long list — the fill animates a width, which React Native cannot run on the native driver, so many bars animating at once drop frames",
			"Passing a value on a different scale without setting max, so a step counter like 3 renders as 3% instead of 3 of 5",
			"Using it for an indeterminate wait by looping a fake value, which tells the user something false about how long is left",
		],
		relatedComponents: ["native-skeleton", "native-text", "native-badge"],
		accessibilityNotes:
			"The primitive sets role=\"progressbar\" and reports the current, minimum and maximum values, so VoiceOver and TalkBack announce the position. Always pass aria-label naming the work. Colour never carries the meaning on its own — pair a threshold recolour with visible text. The fill animates over 300ms, which is short enough not to mislead about the real rate.",
	},
});
