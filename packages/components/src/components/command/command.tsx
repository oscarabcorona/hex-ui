import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../dialog/dialog.js";
import { cn } from "../../lib/utils.js";

/** Root Command container — drives search, filtering, and keyboard navigation over items. */
const Command = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
			className,
		)}
		{...props}
	/>
));
Command.displayName = "Command";

interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
	/** Command children (CommandInput + CommandList + CommandItem, etc.) */
	children: React.ReactNode;
	/** Accessible title for the dialog (screen-reader only by default). */
	title?: string;
	/** Accessible description for the dialog (screen-reader only by default). */
	description?: string;
}

/**
 * Command menu rendered inside a Dialog — a ⌘K-style launcher.
 * @param props - Forwarded to the underlying Dialog (open, onOpenChange, etc.)
 * @returns A Dialog containing a Command menu.
 */
function CommandDialog({
	title = "Command Palette",
	description = "Search for a command to run.",
	children,
	...props
}: CommandDialogProps) {
	return (
		<Dialog {...props}>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogContent className="overflow-hidden p-0">
				<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
}

/** Search input for the Command menu. Fires onValueChange as the user types. */
const CommandInput = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="mr-2 h-4 w-4 shrink-0 opacity-50"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	</div>
));
CommandInput.displayName = "CommandInput";

/** Scrollable list that contains CommandGroup / CommandItem / CommandEmpty. */
const CommandList = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
		{...props}
	/>
));
CommandList.displayName = "CommandList";

/** Rendered when no items match the current search. */
const CommandEmpty = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));
CommandEmpty.displayName = "CommandEmpty";

/** Logical group of items — renders a heading and filters as a unit. */
const CommandGroup = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
CommandGroup.displayName = "CommandGroup";

/** Horizontal rule between groups. */
const CommandSeparator = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 h-px bg-border", className)}
		{...props}
	/>
));
CommandSeparator.displayName = "CommandSeparator";

/** Selectable item. onSelect fires on Enter or click. */
const CommandItem = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
			"data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
			"data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
			"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
			className,
		)}
		{...props}
	/>
));
CommandItem.displayName = "CommandItem";

/**
 * Keyboard shortcut hint (e.g. '⌘K') aligned to the right of an item.
 * @returns A muted inline span rendered at the end of a CommandItem.
 */
function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn(
				"ml-auto text-xs tracking-widest text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
CommandShortcut.displayName = "CommandShortcut";

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
};
