import { markdownSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeMarkdownSchema = deriveNativeSchema(markdownSchema, {
	description:
		"Markdown rendered as React Native elements. Shares the micromark parser the web component uses and replaces only the render step, so a partially-streamed reply renders safely on every token.",
	dependencies: {
		npm: ["mdast-util-from-markdown", "mdast-util-gfm", "micromark-extension-gfm", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "primitives/text/text"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "An assistant reply",
			description: "Markdown inside a message bubble",
			code: "<Message role=\"assistant\">\n  <Markdown>{message.content}</Markdown>\n</Message>",
			composition: ["chat"],
		},
		{
			title: "Streaming",
			description: "Pass the partial text straight through — an unterminated ** or fence parses as literal text",
			code: "<Message role=\"assistant\">\n  <Markdown>{partialText}</Markdown>\n</Message>",
			composition: ["chat", "streaming"],
		},
		{
			title: "Standalone document",
			description: "Release notes or help content rendered outside a conversation",
			code: '<ScrollView contentContainerClassName="p-4">\n  <Markdown>{releaseNotes}</Markdown>\n</ScrollView>',
			composition: ["document"],
		},
	],
	ai: {
		whenToUse:
			"Use for any model output that may contain markdown, and for static documents like release notes. Pass the raw string as the child — including a partial one while a reply streams.",
		whenNotToUse:
			"Don't use it for plain text with no markup; a Text is cheaper. Don't use it to render untrusted HTML — raw HTML is shown as text, never interpreted. Don't use it for syntax-highlighted code with a language picker; that is a dedicated component.",
		commonMistakes: [
			"Wrapping it in a Text — it renders View containers for blocks, and React Native cannot nest a View inside a Text",
			"Passing an object or a message part instead of a string; the child must be the markdown source",
			"Expecting tables and images to render — both fall back to their text content in this version",
			"Sanitising or trimming the stream before passing it, which usually breaks a fence mid-flight; the parser already tolerates partial input",
		],
		relatedComponents: ["native-message", "native-text", "native-message-list"],
		accessibilityNotes:
			"Headings render through the Text heading variants, so they are announced as headings and a screen-reader user can navigate a long reply by structure. Links are announced as links and open through the system handler, with failures ignored rather than crashing a transcript. Code blocks are selectable so they can be copied. Because block content renders as Views, place this as a child of a Message rather than inside a Text.",
	},
});
