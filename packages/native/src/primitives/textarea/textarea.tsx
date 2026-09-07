import type { ComponentProps } from "react";
import { TextInput } from "react-native";
import { cn } from "../../lib/utils.js";

/** Props for {@link Textarea}. */
export type TextareaProps = ComponentProps<typeof TextInput>;

/**
 * A multi-line text field.
 *
 * The same `TextInput` as `Input` with `multiline` set, which changes two
 * defaults worth knowing: text starts vertically centred on iOS unless
 * `textAlignVertical` is set, and Return inserts a newline rather than
 * submitting.
 * @param props - {@link TextareaProps}
 * @returns A multi-line React Native `TextInput`
 * @example
 * ```tsx
 * <Textarea
 *   aria-labelledby="notes"
 *   value={notes}
 *   onChangeText={setNotes}
 *   numberOfLines={4}
 * />
 * ```
 */
export function Textarea({ className, editable = true, ...props }: TextareaProps) {
	return (
		<TextInput
			multiline
			editable={editable}
			textAlignVertical="top"
			className={cn(
				"min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base leading-5 text-foreground",
				"placeholder:text-muted-foreground",
				editable === false && "opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
