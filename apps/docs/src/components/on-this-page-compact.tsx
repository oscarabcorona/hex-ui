"use client";

import { cn } from "../lib/utils";
import type { TocSection } from "./on-this-page";

/**
 * Compact "Jump to…" dropdown TOC. Shown on `lg` viewports (where the right-
 * rail is too cramped). Native `<select>` keeps it accessible and
 * keyboard-navigable with zero custom state.
 */
export function OnThisPageCompact({
	sections,
	className,
}: {
	sections: readonly TocSection[];
	className?: string;
}) {
	if (sections.length === 0) return null;

	return (
		<div className={cn("hidden lg:block xl:hidden", className)}>
			<label className="flex items-center gap-2 text-xs text-muted-foreground">
				<span className="uppercase tracking-wide">On this page</span>
				<select
					defaultValue=""
					onChange={(e) => {
						const id = e.target.value;
						if (!id) return;
						window.location.hash = `#${id}`;
					}}
					className="flex h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					aria-label="Jump to section"
				>
					<option value="" disabled>
						Jump to…
					</option>
					{sections.map((s) => (
						<option key={s.id} value={s.id}>
							{s.title}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
