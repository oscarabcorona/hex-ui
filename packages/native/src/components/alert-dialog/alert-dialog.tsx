import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Props for {@link AlertDialog}. */
export type AlertDialogProps = ComponentProps<typeof AlertDialogPrimitive.Root>;

/**
 * A confirmation modal the user must answer.
 *
 * Unlike `Dialog`, the scrim does not dismiss it: an alert dialog asks a
 * question, so it stays until Cancel or Action is chosen. Needs a
 * `<PortalHost />` in the root layout.
 * @param props - {@link AlertDialogProps}
 * @returns The alert dialog root
 * @example
 * ```tsx
 * <AlertDialog open={open} onOpenChange={setOpen}>
 *   <AlertDialogContent>
 *     <AlertDialogTitle>Delete account?</AlertDialogTitle>
 *     <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
 *     <View className="flex-row justify-end gap-2">
 *       <AlertDialogCancel asChild><Button variant="secondary"><Text>Cancel</Text></Button></AlertDialogCancel>
 *       <AlertDialogAction asChild><Button variant="destructive"><Text>Delete</Text></Button></AlertDialogAction>
 *     </View>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
export function AlertDialog(props: AlertDialogProps) {
	return <AlertDialogPrimitive.Root {...props} />;
}

/** Props for {@link AlertDialogTrigger}. */
export type AlertDialogTriggerProps = ComponentProps<typeof AlertDialogPrimitive.Trigger>;

/**
 * Opens the alert dialog.
 * @param props - {@link AlertDialogTriggerProps}
 * @returns The trigger
 */
export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
	return <AlertDialogPrimitive.Trigger {...props} />;
}

/** Props for {@link AlertDialogContent}. */
export interface AlertDialogContentProps
	extends ComponentProps<typeof AlertDialogPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The alert panel and its scrim. The scrim is deliberately not dismissive.
 * @param props - {@link AlertDialogContentProps}
 * @returns The portalled overlay and panel
 */
export function AlertDialogContent({
	className,
	portalHost,
	children,
	...props
}: AlertDialogContentProps) {
	return (
		<AlertDialogPrimitive.Portal hostName={portalHost}>
			<AlertDialogPrimitive.Overlay className="absolute inset-0 items-center justify-center bg-black/50 p-6">
				<AlertDialogPrimitive.Content
					className={cn(
						"w-full max-w-md gap-4 rounded-xl border border-border bg-background p-6 shadow-lg shadow-black/10",
						className,
					)}
					{...props}
				>
					{children}
				</AlertDialogPrimitive.Content>
			</AlertDialogPrimitive.Overlay>
		</AlertDialogPrimitive.Portal>
	);
}

/** Props for {@link AlertDialogTitle} and {@link AlertDialogDescription}. */
export type AlertDialogTextProps = ComponentProps<typeof AlertDialogPrimitive.Title>;

/**
 * The question being asked. Always include one.
 * @param props - {@link AlertDialogTextProps}
 * @returns The title
 */
export function AlertDialogTitle({ className, ...props }: AlertDialogTextProps) {
	return (
		<AlertDialogPrimitive.Title
			className={cn("text-lg font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

/**
 * The consequence of confirming.
 * @param props - {@link AlertDialogTextProps}
 * @returns The description
 */
export function AlertDialogDescription({ className, ...props }: AlertDialogTextProps) {
	return (
		<AlertDialogPrimitive.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

/** Props for {@link AlertDialogAction} and {@link AlertDialogCancel}. */
export type AlertDialogActionProps = ComponentProps<typeof AlertDialogPrimitive.Action>;

/**
 * Confirms and closes. Wrap a Button with `asChild`.
 * @param props - {@link AlertDialogActionProps}
 * @returns The action control
 */
export function AlertDialogAction(props: AlertDialogActionProps) {
	return <AlertDialogPrimitive.Action {...props} />;
}

/**
 * Dismisses without acting. Wrap a Button with `asChild`.
 * @param props - {@link AlertDialogActionProps}
 * @returns The cancel control
 */
export function AlertDialogCancel(props: AlertDialogActionProps) {
	return <AlertDialogPrimitive.Cancel {...props} />;
}
