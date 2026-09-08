import * as LabelPrimitive from "@rn-primitives/label";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Props for {@link Label}. */
export interface LabelProps extends ComponentProps<typeof LabelPrimitive.Text> {
	/** Grey the label out alongside the control it names. */
	disabled?: boolean;
	/**
	 * Called when the label is tapped, across its whole row rather than just
	 * the glyphs.
	 *
	 * React Native has no `htmlFor`, so pairing `nativeID` with the control's
	 * `aria-labelledby` supplies the accessible **name** and nothing else — a
	 * tap on the caption does not reach the control the way it does in a
	 * browser. Wire this to the same handler as the control to get that
	 * behaviour, which matters most on a 20pt radio dot or a 44pt switch.
	 */
	onPress?: () => void;
}

/**
 * A caption naming a form control.
 *
 * Pass `nativeID` here and point the control's `aria-labelledby` at it —
 * React Native has no `htmlFor`, so the association runs the other way
 * round from the web, and it carries the name only. Pass `onPress` to make
 * the caption an extra touch target for the control.
 * @param props - {@link LabelProps}
 * @returns The label element
 * @example
 * ```tsx
 * <Label nativeID="email">Email address</Label>
 * <Input aria-labelledby="email" />
 * ```
 * @example
 * Widening the touch target of a small control — the tap must be wired
 * explicitly, since `aria-labelledby` does not forward presses:
 * ```tsx
 * <View className="flex-row items-center gap-2">
 *   <Checkbox aria-labelledby="terms" checked={agreed} onCheckedChange={setAgreed} />
 *   <Label nativeID="terms" onPress={() => setAgreed(!agreed)}>
 *     I agree to the terms
 *   </Label>
 * </View>
 * ```
 */
export function Label({ className, disabled = false, onPress, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			// Root is a Pressable, so the handler covers the caption's whole
			// row including the gap — not only the text glyphs it would reach
			// if it were spread onto the Text below.
			onPress={disabled ? undefined : onPress}
			disabled={disabled}
			// Only a caption with a handler is announced as a button. Without
			// this the tappable label read as static text, giving a
			// screen-reader user no cue that it does anything.
			role={onPress ? "button" : undefined}
			className={cn("flex-row items-center gap-2", disabled && "opacity-50")}
		>
			<LabelPrimitive.Text
				className={cn("text-sm font-medium leading-none text-foreground", className)}
				{...props}
			/>
		</LabelPrimitive.Root>
	);
}
