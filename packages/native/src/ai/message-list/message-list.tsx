import { type ReactElement, useCallback, useMemo } from "react";
import { FlatList, type FlatListProps, View } from "react-native";
import { cn } from "../../lib/utils.js";

/**
 * The FlatList props this component owns.
 *
 * They encode the inversion contract — the list is drawn bottom-up over a
 * reversed copy of `messages`, and the two index maps undo that for the
 * caller. Letting a consumer pass `data` or drop `inverted` would leave the
 * list rendering upside down or against the wrong array, so they are removed
 * from the public surface rather than merely overridden at runtime.
 */
type OwnedListProps = "data" | "inverted" | "renderItem" | "keyExtractor" | "ListHeaderComponent";

/**
 * The gap between turns.
 *
 * Hoisted to module scope rather than written inline: an arrow passed as
 * `ItemSeparatorComponent` is a new component type on every render, which
 * remounts every separator in the list.
 * @returns The spacer
 */
function MessageSeparator() {
	return <View className="h-2" />;
}

/** Props for {@link MessageList}. */
export interface MessageListProps<TMessage>
	extends Omit<Partial<FlatListProps<TMessage>>, OwnedListProps> {
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
	//
	// Memoised because `data` identity drives VirtualizedList's diffing: an
	// unmemoised copy is a new array on every render, so a streaming reply
	// re-diffed the entire window on every token.
	const inverted = useMemo(() => [...messages].reverse(), [messages]);

	const renderItem = useCallback(
		({ item, index }: { item: TMessage; index: number }) =>
			renderMessage(item, messages.length - 1 - index),
		[renderMessage, messages.length],
	);

	return (
		<FlatList
			// Cosmetic defaults first, so a consumer can still replace the
			// separator, the padding, or the keyboard behaviour.
			ItemSeparatorComponent={MessageSeparator}
			contentContainerClassName="px-4 py-3"
			keyboardShouldPersistTaps="handled"
			testID="message-list"
			{...props}
			// The inversion contract comes last: these are not overridable,
			// and the prop type removes them so passing one is a compile
			// error rather than a list that renders upside down.
			inverted
			data={inverted}
			renderItem={renderItem}
			keyExtractor={(item, index) => keyExtractor(item, messages.length - 1 - index)}
			// In an inverted list the header renders at the bottom, which is
			// where a typing indicator belongs.
			ListHeaderComponent={footer ? <View className="pb-2">{footer}</View> : null}
			className={cn("flex-1", className)}
		/>
	);
}
