import * as LabelPrimitive from "@rn-primitives/label";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Props for {@link Label}. */
export interface LabelProps extends ComponentProps<typeof LabelPrimitive.Text> {
	/** Grey the label out alongside the control it names. */
	disabled?: boolean;
}

/**
 * A caption naming a form control.
 *
 * Pass `nativeID` here and point the control's `aria-labelledby` at it —
 * React Native has no `htmlFor`, so the association runs the other way
 * round from the web.
 * @param props - {@link LabelProps}
 * @returns The label element
 * @example
 * ```tsx
 * <Label nativeID="email">Email address</Label>
 * <Input aria-labelledby="email" />
 * ```
 */
export function Label({ className, disabled = false, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root className={cn("flex-row items-center gap-2", disabled && "opacity-50")}>
			<LabelPrimitive.Text
				className={cn("text-sm font-medium leading-none text-foreground", className)}
				{...props}
			/>
		</LabelPrimitive.Root>
	);
}
