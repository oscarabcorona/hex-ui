import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Extra touch area around the 16pt box, in points. */
const HIT_SLOP = 12;

/** Props for {@link Checkbox}. */
export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/**
 * A square box the user ticks.
 *
 * Controlled only: pass `checked` and `onCheckedChange` together. The
 * visible box is 16pt, well under the 44pt touch-target minimum, so it
 * carries `hitSlop` to extend the tappable area.
 * @param props - {@link CheckboxProps}
 * @returns The checkbox element
 * @example
 * ```tsx
 * <Checkbox
 *   aria-labelledby="terms"
 *   checked={accepted}
 *   onCheckedChange={setAccepted}
 * />
 * ```
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
	return (
		<CheckboxPrimitive.Root
			hitSlop={HIT_SLOP}
			className={cn(
				"size-4 shrink-0 overflow-hidden rounded-[4px] border border-input",
				props.checked && "border-primary",
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator className="size-full items-center justify-center bg-primary" />
		</CheckboxPrimitive.Root>
	);
}
