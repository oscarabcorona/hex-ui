import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Bubble styles per role. */
export const messageVariants = cva("max-w-[85%] rounded-2xl px-4 py-2.5", {
	variants: {
		role: {
			user: "self-end bg-primary rounded-br-md",
			assistant: "self-start bg-muted rounded-bl-md",
			system: "self-center bg-transparent px-0 py-1",
			tool: "self-start border border-border bg-card",
		},
	},
	defaultVariants: {
		role: "assistant",
	},
});

/** Body-text styles per role, published through `TextClassContext`. */
export const messageTextVariants = cva("text-base", {
	variants: {
		role: {
			user: "text-primary-foreground",
			assistant: "text-foreground",
			system: "text-center text-sm text-muted-foreground",
			tool: "text-sm text-card-foreground",
		},
	},
	defaultVariants: {
		role: "assistant",
	},
});

/**
 * Props for {@link Message}.
 *
 * React Native's `ViewProps` already has a `role` (the accessibility role),
 * which collides with the speaker variant. The variant keeps the name — it
 * matches the web component and the message objects every SDK produces — and
 * the accessibility grouping is owned internally instead.
 */
export type MessageProps = Omit<ComponentProps<typeof View>, "role"> &
	VariantProps<typeof messageVariants> & {
		/**
		 * Group the bubble as a single accessibility element. Defaults to
		 * `true`, which is right for a plain text turn.
		 *
		 * Set it to `false` whenever the bubble contains something the user
		 * must reach on its own — a Markdown link, a ToolCall row, any
		 * Pressable. Grouping collapses the subtree, so a screen-reader user
		 * hears the sentence and can never activate the link inside it.
		 */
		accessible?: boolean;
	};

/**
 * One turn in a conversation.
 *
 * The role decides both the alignment and the colour, and publishes the body
 * text colour to any `Text` inside — so a message body needs no styling of
 * its own.
 * @param props - {@link MessageProps}
 * @returns The message bubble
 * @example
 * ```tsx
 * <Message role="user"><Text>What is the weather?</Text></Message>
 * <Message role="assistant"><Text>Sunny, 21 degrees.</Text></Message>
 * ```
 * @example
 * A turn holding anything interactive must opt out of the grouping, or the
 * link inside it cannot be reached:
 * ```tsx
 * <Message role="assistant" accessible={false}>
 *   <Markdown>{"See [the docs](https://hex-core.dev)"}</Markdown>
 * </Message>
 * ```
 */
export function Message({ className, role, accessible = true, ...props }: MessageProps) {
	return (
		<TextClassContext.Provider value={messageTextVariants({ role })}>
			{/* `accessible` groups the bubble so VoiceOver reads a turn as one
			    unit rather than announcing each fragment separately. It is a
			    prop because that grouping hides any nested link or button. */}
			<View
				accessible={accessible}
				className={cn(messageVariants({ role }), className)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}
