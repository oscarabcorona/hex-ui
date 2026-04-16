"use client";

import { useState } from "react";
import { cn } from "../lib/utils";

/**
 * Two-tab preview pane with accessible tablist semantics.
 * Toggles between the rendered component and its source code.
 * @param children - The rendered component preview
 * @param code - The source code snippet shown in the Code tab
 */
export function ComponentPreview({
	children,
	code,
}: {
	children: React.ReactNode;
	code: string;
}) {
	const [view, setView] = useState<"preview" | "code">("preview");

	return (
		<div className="rounded-lg border">
			<div className="flex items-center border-b px-4" role="tablist" aria-label="Preview or code">
				<button
					type="button"
					role="tab"
					aria-selected={view === "preview"}
					aria-controls="preview-panel"
					onClick={() => setView("preview")}
					className={cn(
						"border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
						view === "preview"
							? "border-foreground text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground",
					)}
				>
					Preview
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={view === "code"}
					aria-controls="code-panel"
					onClick={() => setView("code")}
					className={cn(
						"border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
						view === "code"
							? "border-foreground text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground",
					)}
				>
					Code
				</button>
			</div>
			{view === "preview" ? (
				<div
					id="preview-panel"
					role="tabpanel"
					className="flex min-h-[200px] items-center justify-center p-8"
				>
					{children}
				</div>
			) : (
				<pre id="code-panel" role="tabpanel" className="overflow-x-auto p-6 text-sm">
					<code>{code}</code>
				</pre>
			)}
		</div>
	);
}
