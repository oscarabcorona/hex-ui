import * as TooltipPrimitive from "@rn-primitives/tooltip";
import type { ComponentProps } from "react";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Tooltip}. */
export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>;

/**
 * A brief label shown next to the control that opened it.
 *
 * Touch has no hover, so the trigger **toggles the tooltip on tap** and is
 * uncontrolled — there is no `open` prop on native. That means a tooltip
 * trigger consumes the tap: do not wrap a control that already does
 * something on press. Needs a `<PortalHost />` in the root layout.
 * @param props - {@link TooltipProps}
 * @returns The tooltip root
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button variant="ghost" size="icon" aria-label="Archive"><ArchiveIcon /></Button>
 *   </TooltipTrigger>
 *   <TooltipContent><Text>Archive</Text></TooltipContent>
 * </Tooltip>
 * ```
 */
export function Tooltip(props: TooltipProps) {
	return <TooltipPrimitive.Root {...props} />;
}

/** Props for {@link TooltipTrigger}. */
export type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>;

/**
 * The control the tooltip describes. A tap toggles the bubble, and that tap
 * does not reach whatever the trigger wraps.
 * @param props - {@link TooltipTriggerProps}
 * @returns The trigger
 */
export function TooltipTrigger(props: TooltipTriggerProps) {
	return <TooltipPrimitive.Trigger {...props} />;
}

/** Props for {@link TooltipContent}. */
export interface TooltipContentProps extends ComponentProps<typeof TooltipPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The tooltip bubble. Renders through the portal host.
 * @param props - {@link TooltipContentProps}
 * @returns The portalled bubble
 */
export function TooltipContent({ className, portalHost, ...props }: TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal hostName={portalHost}>
			<TooltipPrimitive.Overlay className="absolute inset-0">
				<TextClassContext.Provider value="text-xs text-primary-foreground">
					<TooltipPrimitive.Content
						className={cn(
							"rounded-md bg-primary px-3 py-1.5 shadow-md shadow-black/10",
							className,
						)}
						{...props}
					/>
				</TextClassContext.Provider>
			</TooltipPrimitive.Overlay>
		</TooltipPrimitive.Portal>
	);
}
