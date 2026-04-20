import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "../../lib/utils.js";

/** Root container for a dropdown menu. */
const DropdownMenu = DropdownMenuPrimitive.Root;

/** The element (button) that opens the dropdown. */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/** Groups related menu items for a11y. */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/** Portals dropdown content into the body. */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/** Nested submenu root. */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/** Group for checkable radio items (one selected at a time). */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/** The visible dropdown panel. */
const DropdownMenuContent = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

/** A clickable menu item. */
const DropdownMenuItem = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
			"transition-all duration-200 ease-out",
			"focus:bg-accent focus:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/** A menu item with a checkbox state. */
const DropdownMenuCheckboxItem = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
			"transition-all duration-200 ease-out",
			"focus:bg-accent focus:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-4 w-4"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

/** A menu item in a radio group. */
const DropdownMenuRadioItem = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
			"transition-all duration-200 ease-out",
			"focus:bg-accent focus:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<svg viewBox="0 0 24 24" className="h-2 w-2 fill-current" aria-hidden="true">
					<circle cx="12" cy="12" r="10" />
				</svg>
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

/** A non-interactive section heading inside the menu. */
const DropdownMenuLabel = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/** Horizontal divider between menu items. */
const DropdownMenuSeparator = React.forwardRef<
	React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-muted", className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/**
 * Right-aligned shortcut text (e.g. ⌘K) shown next to a menu item.
 * @returns A span with muted, tracked typography
 */
function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuRadioGroup,
};
