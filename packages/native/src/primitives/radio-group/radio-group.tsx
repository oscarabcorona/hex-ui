import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils.js";

/** Extra touch area around the 20pt dot, in points. */
const HIT_SLOP = 10;

/** Props for {@link RadioGroup}. */
export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>;

/**
 * A set of mutually exclusive options.
 *
 * Controlled only: pass `value` and `onValueChange`. Exactly one item can be
 * selected, which is what separates this from a list of checkboxes.
 * @param props - {@link RadioGroupProps}
 * @returns The radio group root
 * @example
 * ```tsx
 * <RadioGroup value={plan} onValueChange={setPlan}>
 *   <View className="flex-row items-center gap-2">
 *     <RadioGroupItem value="free" aria-labelledby="plan-free" />
 *     <Label nativeID="plan-free">Free</Label>
 *   </View>
 * </RadioGroup>
 * ```
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
	return <RadioGroupPrimitive.Root className={cn("gap-3", className)} {...props} />;
}

/** Props for {@link RadioGroupItem}. */
export type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item>;

/**
 * One option in a {@link RadioGroup}.
 *
 * Pair each item with a Label through `aria-labelledby` — the dot alone has
 * no accessible name, and the label also enlarges the tap area.
 * @param props - {@link RadioGroupItemProps}
 * @returns The radio item
 */
export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
	return (
		<RadioGroupPrimitive.Item
			hitSlop={HIT_SLOP}
			className={cn(
				"h-5 w-5 shrink-0 items-center justify-center rounded-full border border-input",
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="items-center justify-center">
				<View className="h-2.5 w-2.5 rounded-full bg-primary" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}
