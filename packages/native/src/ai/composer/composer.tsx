import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { cn } from "../../lib/utils.js";

/** Props for {@link Composer}. */
export interface ComposerProps extends Omit<ComponentProps<typeof TextInput>, "onSubmitEditing"> {
	/** Current draft text. */
	value: string;
	/** Called with the new draft on every edit. */
	onChangeText: (next: string) => void;
	/** Called with the trimmed draft when the user sends. */
	onSubmit: (message: string) => void;
	/** Block input and the send control while a reply streams. */
	busy?: boolean;
	/** Accessible name for the send control. */
	sendLabel?: string;
	/** Additional classes on the surrounding bar. */
	className?: string;
}

/**
 * The chat input bar: a growing text field plus a send control.
 *
 * Send is an explicit button rather than a Return key. On a phone Return
 * should insert a newline in a multi-line field, and a visible control is
 * also the only send affordance a screen-reader user can find.
 * @param props - {@link ComposerProps}
 * @returns The composer bar
 * @example
 * ```tsx
 * <Composer
 *   value={draft}
 *   onChangeText={setDraft}
 *   onSubmit={send}
 *   busy={isStreaming}
 * />
 * ```
 */
export function Composer({
	value,
	onChangeText,
	onSubmit,
	busy = false,
	sendLabel = "Send message",
	placeholder = "Message…",
	className,
	...props
}: ComposerProps) {
	const trimmed = value.trim();
	const canSend = trimmed.length > 0 && !busy;

	return (
		<View
			className={cn(
				"flex-row items-end gap-2 border-t border-border bg-background px-4 py-3",
				className,
			)}
		>
			<TextInput
				multiline
				value={value}
				onChangeText={onChangeText}
				editable={!busy}
				placeholder={placeholder}
				textAlignVertical="top"
				className={cn(
					"max-h-32 min-h-10 flex-1 rounded-2xl border border-input bg-background px-4 py-2 text-base leading-5 text-foreground",
					"placeholder:text-muted-foreground",
					busy && "opacity-50",
				)}
				{...props}
			/>
			<Pressable
				role="button"
				aria-label={sendLabel}
				aria-disabled={!canSend}
				disabled={!canSend}
				onPress={() => {
					if (canSend) onSubmit(trimmed);
				}}
				className={cn(
					"h-10 w-10 items-center justify-center rounded-full bg-primary",
					!canSend && "opacity-50",
				)}
			>
				{busy ? <ActivityIndicator size="small" className="text-primary-foreground" /> : null}
			</Pressable>
		</View>
	);
}
