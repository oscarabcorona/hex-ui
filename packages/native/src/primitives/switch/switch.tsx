import * as SwitchPrimitive from "@rn-primitives/switch";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/**
 * Extra touchable area in points beyond the visible track.
 *
 * The track is 44×24, so 10pt vertically brings the target to 44×44 — the
 * platform minimum. Matches the compensation Checkbox and RadioGroupItem
 * already apply.
 */
const HIT_SLOP = 10;

/** Props for {@link Switch}. */
export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

/**
 * An instant-effect on/off control.
 *
 * Controlled only: pass `checked` and `onCheckedChange` together. The
 * change applies immediately — there is no submit step — which is what
 * separates this from Checkbox.
 * @param props - {@link SwitchProps}
 * @returns The switch element
 * @example
 * ```tsx
 * <Switch
 *   aria-labelledby="notifications"
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 * />
 * ```
 */
export function Switch({ className, ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root
			// The track is 44pt wide but only 24pt tall, so the vertical
			// target fell well under the 44pt minimum — the same gap Checkbox
			// and RadioGroupItem already close with their own hitSlop.
			hitSlop={HIT_SLOP}
			className={cn(
				"h-6 w-11 shrink-0 flex-row items-center rounded-full border-2 border-transparent",
				props.checked ? "bg-primary" : "bg-input",
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				className={cn(
					"size-5 rounded-full bg-background",
					props.checked ? "translate-x-5" : "translate-x-0",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}
