import { composerSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeComposerSchema = deriveNativeSchema(composerSchema, {
	description:
		"The chat input bar: a growing text field plus an explicit send control. Return inserts a newline, because a phone keyboard has no modifier to distinguish send from newline.",
	removeProps: ["onValueChange", "submitOnEnter", "children", "disabled"],
	addProps: [
		{
			name: "onChangeText",
			type: "function",
			required: true,
			description: "Called with the new draft on every edit. Replaces the web onValueChange.",
		},
		{
			name: "busy",
			type: "boolean",
			required: false,
			default: false,
			description: "Block input and the send control while a reply streams",
		},
		{
			name: "sendLabel",
			type: "string",
			required: false,
			default: "Send message",
			description: "Accessible name for the send control",
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Basic composer",
			description: "Draft held by the parent, sent on the button",
			code: '<Composer\n  value={draft}\n  onChangeText={setDraft}\n  onSubmit={(message) => {\n    void send(message);\n    setDraft("");\n  }}\n/>',
			composition: ["chat"],
		},
		{
			title: "Blocked while streaming",
			description: "busy dims the field and shows a spinner in the send control",
			code: '<Composer\n  value={draft}\n  onChangeText={setDraft}\n  onSubmit={send}\n  busy={isStreaming}\n/>',
			composition: ["chat", "streaming"],
		},
		{
			title: "Pinned above the keyboard",
			description: "The composer sits under the message list inside a keyboard-aware view",
			code: '<KeyboardAvoidingView\n  behavior={Platform.OS === "ios" ? "padding" : undefined}\n  className="flex-1"\n>\n  <MessageList\n    messages={messages}\n    keyExtractor={(message) => message.id}\n    renderMessage={(message) => (\n      <Message role={message.role}><Text>{message.content}</Text></Message>\n    )}\n  />\n  <Composer value={draft} onChangeText={setDraft} onSubmit={send} />\n</KeyboardAvoidingView>',
			composition: ["chat", "screen"],
		},
	],
	ai: {
		whenToUse:
			"Use as the input bar of a chat surface. Hold the draft in the parent, clear it after sending, and pass busy while a reply is streaming.",
		whenNotToUse:
			"Don't use it as a general form field (use Input or Textarea). Don't use it for a single-line search box. Don't put it inside a scrolling list; it belongs pinned below one.",
		commonMistakes: [
			"Expecting Return to send — it inserts a newline here, because a phone keyboard has no Shift-Return to distinguish the two; sending is the button's job",
			"Forgetting to clear the draft after onSubmit, leaving the sent text in the field",
			"Not passing busy while a reply streams, so the user can fire a second request into a half-finished turn",
			"Placing it outside a KeyboardAvoidingView, so the keyboard covers the bar the moment it is focused",
			"Sending an untrimmed value — the component hands onSubmit the trimmed text and refuses to send whitespace",
		],
		relatedComponents: ["native-message-list", "native-message", "native-input"],
		accessibilityNotes:
			"The send control is a real button with an accessible name from sendLabel, and it reports disabled while the draft is empty or a reply is streaming — so a screen-reader user knows why nothing happens. The field is multi-line and grows to a bounded height, keeping long drafts readable without pushing the list off screen. Keyboard avoidance is the caller's job: wrap the screen in a KeyboardAvoidingView so the bar stays visible.",
	},
});
