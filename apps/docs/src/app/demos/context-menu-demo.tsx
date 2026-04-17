"use client";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "../../components/ui";

/** ContextMenu demo: right-click a region to get a navigation menu. */
export function ContextMenuDemo() {
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-40 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
				Right-click here
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				<ContextMenuItem>
					Back
					<ContextMenuShortcut>⌘[</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem disabled>
					Forward
					<ContextMenuShortcut>⌘]</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>
					Reload
					<ContextMenuShortcut>⌘R</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>
					Save As…
					<ContextMenuShortcut>⌘S</ContextMenuShortcut>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
