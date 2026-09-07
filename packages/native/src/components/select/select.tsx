import * as SelectPrimitive from "@rn-primitives/select";
import type { ComponentProps } from "react";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Select}. */
export type SelectProps = ComponentProps<typeof SelectPrimitive.Root>;

/**
 * A dropdown for choosing one option from a list.
 *
 * The value is an `{ value, label }` object rather than a bare string —
 * React Native has no native option element to read a label back from, so
 * the trigger needs the label handed to it. Needs a `<PortalHost />`.
 * @param props - {@link SelectProps}
 * @returns The select root
 * @example
 * ```tsx
 * <Select value={plan} onValueChange={setPlan}>
 *   <SelectTrigger><SelectValue placeholder="Pick a plan" /></SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="free" label="Free" />
 *     <SelectItem value="pro" label="Pro" />
 *   </SelectContent>
 * </Select>
 * ```
 */
export function Select(props: SelectProps) {
	return <SelectPrimitive.Root {...props} />;
}

/** Props for {@link SelectTrigger}. */
export type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger>;

/**
 * The closed control showing the current value.
 * @param props - {@link SelectTriggerProps}
 * @returns The trigger
 */
export function SelectTrigger({ className, ...props }: SelectTriggerProps) {
	return (
		<TextClassContext.Provider value="text-base text-foreground">
			<SelectPrimitive.Trigger
				className={cn(
					"h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3",
					props.disabled && "opacity-50",
					className,
				)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

/** Props for {@link SelectValue}. */
export type SelectValueProps = ComponentProps<typeof SelectPrimitive.Value>;

/**
 * The selected option's label, or the placeholder when nothing is chosen.
 * @param props - {@link SelectValueProps}
 * @returns The value text
 */
export function SelectValue({ className, ...props }: SelectValueProps) {
	return <SelectPrimitive.Value className={cn("text-base text-foreground", className)} {...props} />;
}

/** Props for {@link SelectContent}. */
export interface SelectContentProps extends ComponentProps<typeof SelectPrimitive.Content> {
	/** Name of the `PortalHost` to render into, when the app mounts more than one. */
	portalHost?: string;
}

/**
 * The option list. Renders through the portal host.
 * @param props - {@link SelectContentProps}
 * @returns The portalled list
 */
export function SelectContent({ className, portalHost, children, ...props }: SelectContentProps) {
	return (
		<SelectPrimitive.Portal hostName={portalHost}>
			<SelectPrimitive.Overlay className="absolute inset-0">
				<SelectPrimitive.Content
					className={cn(
						"w-full rounded-md border border-border bg-popover p-1 shadow-md shadow-black/10",
						className,
					)}
					{...props}
				>
					{children}
				</SelectPrimitive.Content>
			</SelectPrimitive.Overlay>
		</SelectPrimitive.Portal>
	);
}

/** Props for {@link SelectItem}. */
export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;

/**
 * One option. `label` is what the trigger shows once it is picked, so it is
 * required alongside `value`.
 * @param props - {@link SelectItemProps}
 * @returns The option row
 */
export function SelectItem({ className, label, ...props }: SelectItemProps) {
	return (
		<SelectPrimitive.Item
			label={label}
			className={cn(
				"h-10 w-full flex-row items-center justify-between rounded-sm px-2 active:bg-accent",
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<SelectPrimitive.ItemText className="text-base text-popover-foreground" />
			<SelectPrimitive.ItemIndicator>
				<SelectPrimitive.Value placeholder="" className="text-primary" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

/** Props for {@link SelectSeparator}. */
export type SelectSeparatorProps = ComponentProps<typeof SelectPrimitive.Separator>;

/**
 * A rule between option groups.
 * @param props - {@link SelectSeparatorProps}
 * @returns The separator
 */
export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
	return <SelectPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />;
}
