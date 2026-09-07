import type { ComponentProps } from "react";
import { TextInput } from "react-native";
import { cn } from "../../lib/utils.js";

/** Props for {@link Input}. */
export type InputProps = ComponentProps<typeof TextInput>;

/**
 * A single-line text field.
 *
 * React Native reports edits through `onChangeText`, which hands you the
 * string directly — there is no event object and no `event.target.value`.
 * Disable the field with `editable={false}` rather than a `disabled` prop.
 * @param props - {@link InputProps}
 * @returns A React Native `TextInput`
 * @example
 * ```tsx
 * <Label nativeID="email">Email</Label>
 * <Input
 *   aria-labelledby="email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 *   autoCapitalize="none"
 * />
 * ```
 */
export function Input({ className, editable = true, ...props }: InputProps) {
	return (
		<TextInput
			editable={editable}
			className={cn(
				"h-10 w-full flex-row items-center rounded-md border border-input bg-background px-3 py-1 text-base leading-5 text-foreground",
				"placeholder:text-muted-foreground",
				editable === false && "opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
