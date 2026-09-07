import * as SwitchPrimitive from "@rn-primitives/switch";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

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
