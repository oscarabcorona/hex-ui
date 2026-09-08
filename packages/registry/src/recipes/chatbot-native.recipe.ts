import type { RecipeDefinition } from "../recipe-schema.js";

export const chatbotNativeRecipe: RecipeDefinition = {
	slug: "chatbot-native",
	title: "Chatbot (React Native)",
	summary:
		"Streaming chatbot for Expo. An inverted <MessageList> keeps the newest turn in view while a reply grows, assistant text renders through the native <Markdown> renderer, tool invocations collapse into <ToolCall> rows, and the <Composer> pins above the keyboard. The proof that the AI Kit works on a device, not just in a browser.",
	tags: ["ai", "chat", "chatbot", "streaming", "react-native", "expo", "native"],
	brief:
		"Build a streaming chatbot in an Expo app. Hold the message array in state, render it through <MessageList> (pass it oldest-first — the list inverts internally) with one <Message> per turn, and render assistant content with <Markdown> so partial streamed text stays valid on every token. Put <Composer> below the list inside a KeyboardAvoidingView; sending is the button, because Return inserts a newline on a phone. Streaming needs expo/fetch rather than the global fetch — React Native's built-in fetch does not expose a readable body, so a stream never arrives. Mount <PortalHost /> in the root layout if the screen uses any overlay. Install with `hex add chatbot-native` on a project already set up by `hex init --platform native`.",
	steps: [
		{
			component: "native-message-list",
			reason: "Inverted transcript that stays pinned to the newest turn while a reply streams",
			role: "primary",
		},
		{
			component: "native-message",
			reason: "One chat turn, aligned and coloured by role",
			role: "primary",
		},
		{
			component: "native-markdown",
			reason: "Renders assistant text natively; partial markup parses as literal text rather than throwing",
			role: "primary",
		},
		{
			component: "native-composer",
			reason: "Input bar with an explicit send control and a busy state",
			role: "primary",
		},
		{
			component: "native-tool-call",
			reason: "Collapsed record of each tool invocation, so the transcript stays scannable",
			role: "optional",
		},
		{
			component: "native-text",
			reason: "Every string on screen lives in a Text; message bodies inherit their colour from the bubble",
			role: "supporting",
		},
	],
	checklist: [
		{
			id: "expo-fetch-for-streaming",
			check:
				"Stream with expo/fetch, not the global fetch. React Native's built-in fetch does not expose a readable body, so the response arrives only when the model finishes and nothing streams.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "keyboard-avoiding-view",
			check:
				"Wrap the screen in a KeyboardAvoidingView. Without it the keyboard covers the composer the moment it is focused, and the user cannot see what they are typing.",
			severity: "blocker",
			source: "author",
		},
		{
			id: "messages-oldest-first",
			check:
				"Pass messages to <MessageList> oldest-first. The list inverts internally; reversing them yourself double-inverts and shows the oldest turn at the bottom.",
			severity: "warn",
			source: "author",
		},
		{
			id: "assistant-via-markdown",
			check:
				"Render assistant content through <Markdown>, not a plain <Text>. Raw text shows literal asterisks and backticks, and drops code blocks entirely.",
			severity: "warn",
			source: "author",
		},
		{
			id: "composer-busy-while-streaming",
			check:
				"Pass busy to <Composer> while a reply streams. Without it the user can fire a second request into a half-finished turn.",
			severity: "warn",
			source: "author",
		},
		{
			id: "stable-message-key",
			check:
				"Key each turn on its id, never the array index. A streaming turn changes on every token, and index keys remount the bubble and lose scroll position.",
			severity: "nit",
			source: "author",
		},
		{
			id: "portal-host-for-overlays",
			check:
				"Mount <PortalHost /> from @rn-primitives/portal in the root layout if the screen opens any overlay. Without it a sheet or dialog mounts and renders nothing, with no error.",
			severity: "nit",
			source: "author",
		},
	],
	example: `// app/chat.tsx
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { fetch as expoFetch } from "expo/fetch";
import {
  Composer,
  Markdown,
  Message,
  MessageList,
  Text,
} from "@/components/ui";

interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);

  async function send(text: string) {
    const userTurn: Turn = { id: \`u\${Date.now()}\`, role: "user", content: text };
    const replyId = \`a\${Date.now()}\`;
    setMessages((current) => [...current, userTurn, { id: replyId, role: "assistant", content: "" }]);
    setDraft("");
    setStreaming(true);

    // expo/fetch, not the global fetch: React Native's built-in fetch has no
    // readable body, so the reply would arrive in one lump at the end.
    const response = await expoFetch("https://example.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userTurn] }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setMessages((current) =>
        current.map((turn) =>
          turn.id === replyId ? { ...turn, content: turn.content + chunk } : turn,
        ),
      );
    }
    setStreaming(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <MessageList
        messages={messages}
        keyExtractor={(turn) => turn.id}
        footer={streaming ? <Text variant="muted">Thinking…</Text> : null}
        renderMessage={(turn) => (
          <Message role={turn.role}>
            {turn.role === "assistant" ? (
              <Markdown>{turn.content}</Markdown>
            ) : (
              <Text>{turn.content}</Text>
            )}
          </Message>
        )}
      />
      <Composer
        value={draft}
        onChangeText={setDraft}
        onSubmit={(text) => void send(text)}
        busy={streaming}
      />
    </KeyboardAvoidingView>
  );
}`,
	tokenBudget: 2600,
};
