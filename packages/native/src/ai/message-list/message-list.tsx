import { type ReactElement, useCallback } from "react";
import { FlatList, type FlatListProps, View } from "react-native";
import { cn } from "../../lib/utils.js";

/** Props for {@link MessageList}. */
export interface MessageListProps<TMessage> extends Partial<FlatListProps<TMessage>> {
	/** Turns, oldest first — the same order you store them in. */
	messages: readonly TMessage[];
	/** Render one turn. */
	renderMessage: (message: TMessage, index: number) => ReactElement;
	/** Stable identity per turn. */
	keyExtractor: (message: TMessage, index: number) => string;
	/** Rendered under the last turn, e.g. a typing indicator. */
	footer?: ReactElement | null;
	/** Additional classes on the list. */
	className?: string;
}

/**
 * A scrolling conversation that stays pinned to the newest turn.
 *
 * Renders inverted: the list is drawn from the bottom up, which is what
 * keeps the newest message in view while earlier ones scroll away, and what
 * stops the view jumping when a streaming reply grows. The `messages` array
 * is passed oldest-first and reversed internally, so callers never store
 * their history backwards to satisfy the list.
 * @param props - {@link MessageListProps}
 * @returns The conversation list
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   keyExtractor={(m) => m.id}
 *   renderMessage={(m) => (
 *     <Message role={m.role}><Text>{m.content}</Text></Message>
 *   )}
 * />
 * ```
 */
export function MessageList<TMessage>({
	messages,
	renderMessage,
	keyExtractor,
	footer,
	className,
	...props
}: MessageListProps<TMessage>) {
	// Inverted lists render index 0 at the bottom, so the newest turn has to
	// come first in the data. Reversing here keeps the caller's array in the
	// natural oldest-first order.
	const inverted = [...messages].reverse();

	const renderItem = useCallback(
		({ item, index }: { item: TMessage; index: number }) =>
			renderMessage(item, messages.length - 1 - index),
		[renderMessage, messages.length],
	);

	return (
		<FlatList
			inverted
			data={inverted}
			renderItem={renderItem}
			keyExtractor={(item, index) => keyExtractor(item, messages.length - 1 - index)}
			// In an inverted list the header renders at the bottom, which is
			// where a typing indicator belongs.
			ListHeaderComponent={footer ? <View className="pb-2">{footer}</View> : null}
			ItemSeparatorComponent={() => <View className="h-2" />}
			contentContainerClassName="px-4 py-3"
			testID="message-list"
			className={cn("flex-1", className)}
			keyboardShouldPersistTaps="handled"
			{...props}
		/>
	);
}
