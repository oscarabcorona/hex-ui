import { messageSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeMessageSchema = deriveNativeSchema(messageSchema, {
	description:
		"One turn in a conversation. The role sets the alignment and colour, and publishes the body text colour so the message content needs no styling of its own.",
	dependencies: {
		npm: ["class-variance-authority", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "A user and an assistant turn",
			description: "Alignment and colour come from the role alone",
			code: '<View className="gap-2">\n  <Message role="user">\n    <Text>What is the weather?</Text>\n  </Message>\n  <Message role="assistant">\n    <Text>Sunny, 21 degrees.</Text>\n  </Message>\n</View>',
			composition: ["chat"],
		},
		{
			title: "Streaming an assistant reply",
			description: "Render the partial text as it arrives; the bubble grows with it",
			code: '<Message role="assistant">\n  <Text>{partialText}</Text>\n  {isStreaming ? <ActivityIndicator size="small" /> : null}\n</Message>',
			composition: ["chat", "streaming"],
		},
		{
			title: "A system note",
			description: "Centred and muted, for context rather than conversation",
			code: '<Message role="system">\n  <Text>Model switched to the fast tier.</Text>\n</Message>',
			composition: ["chat", "system"],
		},
	],
	ai: {
		whenToUse:
			"Use for each turn in a chat surface. Pass the role from your message objects and put the body in a Text child; for assistant turns carrying markdown, render it with the native Markdown component instead of a plain Text.",
		whenNotToUse:
			"Don't use it for a tool invocation with arguments and a result (use ToolCall). Don't use it for a list row or a notification. Don't nest one message inside another.",
		commonMistakes: [
			"Passing a bare string as the child — React Native throws; wrap the body in Text or Markdown",
			"Styling the body text directly instead of letting the role publish its colour, which breaks the contrast pairing on user bubbles",
			"Rendering raw markdown as plain Text, so an assistant reply shows literal asterisks and backticks",
			"Giving every message the same role, which removes the only signal of who is speaking",
		],
		relatedComponents: ["native-text", "native-message-list", "native-tool-call", "native-markdown"],
		accessibilityNotes:
			"Each bubble is grouped as one accessibility element so VoiceOver reads a turn as a unit rather than word by word. Alignment and colour both encode the speaker, but neither is available to a screen-reader user, so include the speaker in the surrounding structure — a preceding label, or the accessible name of the list row. The role colour pairings are contrast-audited in light and dark.",
	},
});
