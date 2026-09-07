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
export type MessageProps = Omit<ComponentProps<typeof View>, "role"> & VariantProps<typeof messageVariants>;

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
 */
export function Message({ className, role, ...props }: MessageProps) {
	return (
		<TextClassContext.Provider value={messageTextVariants({ role })}>
			{/* `accessible` groups the bubble so VoiceOver reads a turn as one
			    unit rather than announcing each fragment separately. */}
			<View accessible className={cn(messageVariants({ role }), className)} {...props} />
		</TextClassContext.Provider>
	);
}
