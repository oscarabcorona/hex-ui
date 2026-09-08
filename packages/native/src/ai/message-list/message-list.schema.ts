import { messageListSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeMessageListSchema = deriveNativeSchema(messageListSchema, {
	description:
		"A scrolling conversation pinned to the newest turn. Built on an inverted FlatList, so a streaming reply grows without pushing the view around.",
	removeProps: ["children", "autoScroll"],
	addProps: [
		{
			name: "messages",
			type: "object",
			required: true,
			description: "The turns, oldest first. The list reverses internally for the inverted layout.",
		},
		{
			name: "renderMessage",
			type: "function",
			required: true,
			description: "Renders one turn: (message, index) => ReactElement",
		},
		{
			name: "keyExtractor",
			type: "function",
			required: true,
			description: "Stable identity per turn: (message, index) => string",
		},
		{
			name: "footer",
			type: "ReactNode",
			required: false,
			description: "Rendered under the newest turn — a typing indicator, or a retry affordance",
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "A conversation",
			description: "Pass messages oldest-first; the list handles the inversion",
			code: '<MessageList\n  messages={messages}\n  keyExtractor={(message) => message.id}\n  renderMessage={(message) => (\n    <Message role={message.role}>\n      <Text>{message.content}</Text>\n    </Message>\n  )}\n/>',
			composition: ["chat"],
		},
		{
			title: "With a typing indicator",
			description: "The footer renders under the newest turn",
			code: '<MessageList\n  messages={messages}\n  keyExtractor={(message) => message.id}\n  renderMessage={(message) => (\n    <Message role={message.role}><Text>{message.content}</Text></Message>\n  )}\n  footer={isStreaming ? <ActivityIndicator size="small" /> : null}\n/>',
			composition: ["chat", "streaming"],
		},
		{
			title: "Inside a keyboard-aware screen",
			description: "The list takes the free space above the composer",
			code: '<KeyboardAvoidingView\n  behavior={Platform.OS === "ios" ? "padding" : undefined}\n  className="flex-1"\n>\n  <MessageList\n    messages={messages}\n    keyExtractor={(message) => message.id}\n    renderMessage={(message) => (\n      <Message role={message.role}><Text>{message.content}</Text></Message>\n    )}\n  />\n  <Composer value={draft} onChangeText={setDraft} onSubmit={send} />\n</KeyboardAvoidingView>',
			composition: ["chat", "screen"],
		},
	],
	ai: {
		whenToUse:
			"Use as the scrolling body of a chat surface. Give it the message array, a key extractor and a renderer, and let it own the scroll position.",
		whenNotToUse:
			"Don't use it for a short fixed set of turns that fits on screen — a plain View with a gap is lighter. Don't nest it inside another scroll view; two scrollables on the same axis fight over the gesture.",
		commonMistakes: [
			"Reversing the messages array before passing it in, which double-inverts the list and shows the oldest turn at the bottom",
			"Deriving keys from the array index, so a streaming turn remounts on every token and loses its scroll position",
			"Wrapping it in a ScrollView, which breaks virtualisation and the stick-to-bottom behaviour at once",
			"Putting the typing indicator in the data array instead of the footer, which makes it a real list item that has to be added and removed",
			"Giving it no bounded height — inside a flex column it needs flex-1, or it collapses to nothing",
		],
		relatedComponents: ["native-message", "native-composer", "native-text"],
		accessibilityNotes:
			"An inverted FlatList reverses the visual order but keeps each turn its own element, so VoiceOver still reads them one at a time. Because the newest turn is at the bottom and the list is inverted, announce arriving replies through the message content itself rather than relying on scroll position. Set keyboardShouldPersistTaps so a tap on a message does not get eaten by the keyboard dismissing, which the component already does.",
	},
});
