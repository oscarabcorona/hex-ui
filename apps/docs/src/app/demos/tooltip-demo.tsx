"use client";

import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../components/ui";

/** Tooltip demo: icon button with hover label. */
export function TooltipDemo() {
	return (
		<TooltipProvider>
			<div className="flex gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" aria-label="Add item">
							+
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Add item</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" aria-label="Delete item">
							×
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete item</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
