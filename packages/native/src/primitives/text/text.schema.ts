import type { ComponentSchemaInput } from "@hex-core/registry";

/**
 * Native-only: the web catalog styles text with Tailwind on any element and
 * has no Text primitive, so this schema is authored standalone rather than
 * derived. It is the first item to exercise the standalone native path.
 */
export const nativeTextSchema: ComponentSchemaInput = {
	name: "native-text",
	platform: "native",
	displayName: "Text",
	description:
		"Typography primitive for React Native. Every string on screen must live inside a Text; this one carries the theme's foreground colour, a typographic variant scale, and inherits classes from styled parents (Button, Card, Badge) through TextClassContext.",
	category: "primitive",
	subcategory: "typography",
	props: [
		{
			name: "variant",
			type: "enum",
			required: false,
			default: "default",
			description: "Typographic role — headings, body, lead, small, muted, code",
			enumValues: ["default", "h1", "h2", "h3", "h4", "p", "lead", "large", "small", "muted", "code"],
		},
		{
			name: "className",
			type: "string",
			required: false,
			description: "Additional NativeWind classes; wins over both the variant and any inherited parent classes",
		},
		{
			name: "numberOfLines",
			type: "number",
			required: false,
			description: "Truncate to this many lines with an ellipsis (React Native Text prop)",
		},
		{
			name: "selectable",
			type: "boolean",
			required: false,
			default: false,
			description: "Let the user long-press to select and copy the text",
		},
	],
	variants: [
		{
			name: "variant",
			description: "Typographic scale",
			values: [
				{
					value: "default",
					description: "Body text at the base size in the foreground colour",
					useWhen: "ordinary copy, list rows, form values — anything without a more specific role",
				},
				{
					value: "h1",
					description: "Screen title (4xl, extrabold); announced as a heading",
					useWhen: "the single top-level title of a screen — one per screen",
				},
				{
					value: "h2",
					description: "Section heading (3xl, semibold); announced as a heading",
					useWhen: "major sections inside a screen (Account, Notifications, Billing)",
				},
				{
					value: "h3",
					description: "Card or group heading (2xl, semibold); announced as a heading",
					useWhen: "the title of a Card or a grouped list",
				},
				{
					value: "h4",
					description: "Minor heading (xl, semibold); announced as a heading",
					useWhen: "sub-groups within a card or settings section",
				},
				{
					value: "p",
					description: "Paragraph with relaxed line height",
					useWhen: "multi-line prose such as descriptions, empty-state copy, onboarding text",
				},
				{
					value: "lead",
					description: "Large muted intro text",
					useWhen: "the one-sentence subtitle under a screen title",
				},
				{
					value: "large",
					description: "Large semibold text",
					useWhen: "a key figure or emphasised value (a balance, a count)",
				},
				{
					value: "small",
					description: "Small medium-weight label with tight line height",
					useWhen: "field labels, metadata, timestamps that must stay compact",
				},
				{
					value: "muted",
					description: "Small text in the muted foreground colour",
					useWhen: "helper text, secondary descriptions, placeholders rendered as text",
				},
				{
					value: "code",
					description: "Inline code chip on the muted background",
					useWhen: "an identifier, command or token the user might copy",
				},
			],
			default: "default",
		},
	],
	slots: [
		{
			name: "children",
			description: "The string to render, or nested Text elements for mixed styling",
			required: true,
			acceptedTypes: ["string", "ReactNode"],
		},
	],
	dependencies: {
		npm: ["class-variance-authority", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	tokensUsed: ["foreground", "muted-foreground", "muted"],
	examples: [
		{
			title: "Heading and body",
			description: "A screen title with a muted subtitle",
			code: '<View className="gap-1">\n  <Text variant="h1">Settings</Text>\n  <Text variant="muted">Manage your account preferences.</Text>\n</View>',
			composition: ["screen-header"],
		},
		{
			title: "Inheriting from a parent",
			description: "The Button publishes its label classes; the Text picks them up without any prop",
			code: '<Button variant="destructive" onPress={remove}>\n  <Text>Delete</Text>\n</Button>',
			composition: ["button", "inheritance"],
		},
		{
			title: "Truncated row label",
			description: "Single-line label that ellipsises inside a list row",
			code: '<Text numberOfLines={1} className="flex-1">\n  {conversation.title}\n</Text>',
			composition: ["list-row", "truncate"],
		},
		{
			title: "Inline code",
			description: "An identifier the user might copy",
			code: '<Text selectable variant="code">hex add native-button</Text>',
			composition: ["code", "copy"],
		},
	],
	ai: {
		whenToUse:
			"Use for every string rendered in a React Native screen. Reach for a heading variant (h1–h4) for titles so screen readers announce them, 'muted' or 'small' for secondary copy, and the default variant everywhere else.",
		whenNotToUse:
			"Don't render text outside a Text — React Native throws when a bare string is a child of a View. Don't use it for editable content (use Input or Textarea). Don't stack many variants to build a layout; wrap Text elements in a View with gap classes instead.",
		commonMistakes: [
			"Importing Text from react-native directly — the raw element ignores the theme foreground colour and the class inheritance parents rely on, so a Button label renders in default black on a dark button",
			"Passing a bare string as a Button or Card child instead of wrapping it in Text — React Native throws 'Text strings must be rendered within a <Text> component'",
			"Putting a View inside a Text to build a layout — nest Text inside Text for mixed styling, but use a View container for anything positional",
			"Reaching for h1 more than once per screen — VoiceOver users navigate by heading, and several h1s flatten the hierarchy",
		],
		relatedComponents: ["native-button", "native-badge", "native-card"],
		accessibilityNotes:
			"Heading variants (h1–h4) set role=\"heading\" so VoiceOver and TalkBack announce them and users can jump between them; React Native has no aria-level, so the hierarchy comes from reading order. Body text has no role. Keep contrast by using the foreground and muted-foreground tokens rather than custom colours; both are audited in light and dark.",
	},
	tags: ["text", "typography", "heading", "label", "native", "react-native"],
};
