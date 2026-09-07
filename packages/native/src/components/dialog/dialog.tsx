import * as DialogPrimitive from "@rn-primitives/dialog";
import type { ComponentProps } from "react";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";
import { Text } from "../../primitives/text/text.js";

/** Props for {@link Dialog}. */
export type DialogProps = ComponentProps<typeof DialogPrimitive.Root>;

/**
 * A modal surface layered over the screen.
 *
 * Requires a `<PortalHost />` mounted once in the app's root layout — the
 * content renders through it, not in place. Without one nothing appears.
 * @param props - {@link DialogProps}
 * @returns The dialog root
 * @example
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent>
 *     <DialogTitle>Delete project</DialogTitle>
 *     <DialogDescription>This cannot be undone.</DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function Dialog(props: DialogProps) {
	return <DialogPrimitive.Root {...props} />;
}

/** Props for {@link DialogTrigger}. */
export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

/**
 * Opens the dialog. Optional — controlling `open` from the parent works too.
 * @param props - {@link DialogTriggerProps}
 * @returns The trigger
 */
export function DialogTrigger(props: DialogTriggerProps) {
	return <DialogPrimitive.Trigger {...props} />;
}

/** Props for {@link DialogContent}. */
export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The dialog panel, with its scrim. Renders through the portal host.
 * @param props - {@link DialogContentProps}
 * @returns The portalled overlay and panel
 */
export function DialogContent({ className, portalHost, children, ...props }: DialogContentProps) {
	return (
		<DialogPrimitive.Portal hostName={portalHost}>
			<DialogPrimitive.Overlay className="absolute inset-0 items-center justify-center bg-black/50 p-6">
				<DialogPrimitive.Content
					className={cn(
						"w-full max-w-md gap-4 rounded-xl border border-border bg-background p-6 shadow-lg shadow-black/10",
						className,
					)}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogPrimitive.Overlay>
		</DialogPrimitive.Portal>
	);
}

/** Props for {@link DialogTitle} and {@link DialogDescription}. */
export type DialogTextProps = ComponentProps<typeof DialogPrimitive.Title>;

/**
 * The dialog's title. Announced when the dialog opens, so always include one.
 * @param props - {@link DialogTextProps}
 * @returns The title
 */
export function DialogTitle({ className, ...props }: DialogTextProps) {
	return (
		<TextClassContext.Provider value="text-lg font-semibold text-foreground">
			<DialogPrimitive.Title className={cn("text-lg font-semibold text-foreground", className)} {...props} />
		</TextClassContext.Provider>
	);
}

/**
 * A muted line under the title explaining the consequence.
 * @param props - {@link DialogTextProps}
 * @returns The description
 */
export function DialogDescription({ className, ...props }: DialogTextProps) {
	return (
		<DialogPrimitive.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

/** Props for {@link DialogFooter}. */
export type DialogFooterProps = ComponentProps<typeof Text>;

/** Props for {@link DialogClose}. */
export type DialogCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

/**
 * Dismisses the dialog. Wrap a Button in it with `asChild`.
 * @param props - {@link DialogCloseProps}
 * @returns The close control
 */
export function DialogClose(props: DialogCloseProps) {
	return <DialogPrimitive.Close {...props} />;
}
