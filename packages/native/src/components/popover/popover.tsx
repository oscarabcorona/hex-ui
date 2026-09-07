import * as PopoverPrimitive from "@rn-primitives/popover";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Props for {@link Popover}. */
export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>;

/**
 * A small panel anchored to the control that opened it.
 *
 * Needs a `<PortalHost />` in the root layout. On a phone, prefer this only
 * for genuinely small content — anything list-shaped or taller than a few
 * rows belongs in a sheet.
 * @param props - {@link PopoverProps}
 * @returns The popover root
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline"><Text>Filters</Text></Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <Text>Filter options</Text>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
export function Popover(props: PopoverProps) {
	return <PopoverPrimitive.Root {...props} />;
}

/** Props for {@link PopoverTrigger}. */
export type PopoverTriggerProps = ComponentProps<typeof PopoverPrimitive.Trigger>;

/**
 * The control the panel is anchored to.
 * @param props - {@link PopoverTriggerProps}
 * @returns The trigger
 */
export function PopoverTrigger(props: PopoverTriggerProps) {
	return <PopoverPrimitive.Trigger {...props} />;
}

/** Props for {@link PopoverContent}. */
export interface PopoverContentProps extends ComponentProps<typeof PopoverPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The panel. Renders through the portal host, over an invisible scrim that
 * closes it on an outside tap.
 * @param props - {@link PopoverContentProps}
 * @returns The portalled panel
 */
export function PopoverContent({ className, portalHost, ...props }: PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal hostName={portalHost}>
			<PopoverPrimitive.Overlay className="absolute inset-0">
				<PopoverPrimitive.Content
					className={cn(
						"w-72 gap-2 rounded-lg border border-border bg-popover p-4 shadow-md shadow-black/10",
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Overlay>
		</PopoverPrimitive.Portal>
	);
}
