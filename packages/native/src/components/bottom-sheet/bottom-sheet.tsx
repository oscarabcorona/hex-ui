import * as DialogPrimitive from "@rn-primitives/dialog";
import { type ComponentProps, useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "../../lib/utils.js";

/** How long the sheet takes to slide in or out, in milliseconds. */
const SLIDE_DURATION = 220;

/** Props for {@link BottomSheet}. */
export type BottomSheetProps = ComponentProps<typeof DialogPrimitive.Root>;

/**
 * A panel that rises from the bottom of the screen.
 *
 * The native answer to a menu, an option list, or a short form — everything
 * a web app would hang in a dropdown or a popover, where a thumb cannot
 * comfortably reach. Built on the dialog primitive, so it is modal and needs
 * a `<PortalHost />` in the root layout.
 *
 * This has no web counterpart in the catalog: on a desktop the same job is
 * done by DropdownMenu, Popover or Dialog.
 * @param props - {@link BottomSheetProps}
 * @returns The sheet root
 * @example
 * ```tsx
 * <BottomSheet open={open} onOpenChange={setOpen}>
 *   <BottomSheetContent>
 *     <BottomSheetTitle>Sort by</BottomSheetTitle>
 *     <RadioGroup value={sort} onValueChange={setSort}>…</RadioGroup>
 *   </BottomSheetContent>
 * </BottomSheet>
 * ```
 */
export function BottomSheet(props: BottomSheetProps) {
	return <DialogPrimitive.Root {...props} />;
}

/** Props for {@link BottomSheetTrigger}. */
export type BottomSheetTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

/**
 * Opens the sheet.
 * @param props - {@link BottomSheetTriggerProps}
 * @returns The trigger
 */
export function BottomSheetTrigger(props: BottomSheetTriggerProps) {
	return <DialogPrimitive.Trigger {...props} />;
}

/** Props for {@link BottomSheetContent}. */
export interface BottomSheetContentProps
	extends ComponentProps<typeof DialogPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The sheet panel. Slides up from the bottom edge and pads itself past the
 * home indicator.
 * @param props - {@link BottomSheetContentProps}
 * @returns The portalled sheet
 */
export function BottomSheetContent({
	className,
	portalHost,
	children,
	...props
}: BottomSheetContentProps) {
	const insets = useSafeAreaInsets();
	const { height } = useWindowDimensions();
	const translateY = useRef(new Animated.Value(height)).current;

	useEffect(() => {
		const animation = Animated.timing(translateY, {
			toValue: 0,
			duration: SLIDE_DURATION,
			useNativeDriver: true,
		});
		animation.start();
		return () => {
			animation.stop();
		};
	}, [translateY]);

	return (
		<DialogPrimitive.Portal hostName={portalHost}>
			<DialogPrimitive.Overlay className="absolute inset-0 justify-end bg-black/50">
				<DialogPrimitive.Content
					className={cn(
						"w-full gap-4 rounded-t-2xl border-t border-border bg-background px-6 pt-6",
						className,
					)}
					style={{ transform: [{ translateY }], paddingBottom: insets.bottom + 24 }}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogPrimitive.Overlay>
		</DialogPrimitive.Portal>
	);
}

/** Props for {@link BottomSheetTitle} and {@link BottomSheetDescription}. */
export type BottomSheetTextProps = ComponentProps<typeof DialogPrimitive.Title>;

/**
 * The sheet's title. Announced when it opens, so always include one.
 * @param props - {@link BottomSheetTextProps}
 * @returns The title
 */
export function BottomSheetTitle({ className, ...props }: BottomSheetTextProps) {
	return (
		<DialogPrimitive.Title
			className={cn("text-lg font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

/**
 * A muted line under the title.
 * @param props - {@link BottomSheetTextProps}
 * @returns The description
 */
export function BottomSheetDescription({ className, ...props }: BottomSheetTextProps) {
	return (
		<DialogPrimitive.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

/** Props for {@link BottomSheetClose}. */
export type BottomSheetCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

/**
 * Dismisses the sheet. Wrap a Button with `asChild`.
 * @param props - {@link BottomSheetCloseProps}
 * @returns The close control
 */
export function BottomSheetClose(props: BottomSheetCloseProps) {
	return <DialogPrimitive.Close {...props} />;
}
