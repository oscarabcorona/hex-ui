"use client";

import { useState } from "react";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../components/ui";

/** Collapsible demo: starred repos list with show-more expansion. */
export function CollapsibleDemo() {
	const [open, setOpen] = useState(false);
	return (
		<Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
			<div className="flex items-center justify-between space-x-4 px-4">
				<h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm">
						{open ? "Hide" : "Show"}
					</Button>
				</CollapsibleTrigger>
			</div>
			<div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
			<CollapsibleContent className="space-y-2">
				<div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
				<div className="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
