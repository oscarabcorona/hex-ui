"use client";

import { useState } from "react";
import { CodeBlockCopy } from "./code-block-copy";
import { cn } from "../lib/utils";

/**
 * Two-tab preview pane with accessible tablist semantics.
 * Toggles between the rendered component and its highlighted source code.
 * @param children - The rendered component preview
 * @param code - The raw source code (used for the copy button payload)
 * @param codeHtml - Shiki-highlighted HTML for the Code tab
 */
export function ComponentPreview({
	children,
	code,
	codeHtml,
}: {
	children: React.ReactNode;
	code: string;
	codeHtml: string;
}) {
	const [view, setView] = useState<"preview" | "code">("preview");

	return (
		<div className="overflow-hidden rounded-lg border">
			<div className="flex items-center border-b px-4" role="tablist" aria-label="Preview or code">
				<button
					type="button"
					role="tab"
					aria-selected={view === "preview"}
					aria-controls="preview-panel"
					onClick={() => setView("preview")}
					className={cn(
						"border-b-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
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
						"border-b-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
						view === "code"
							? "border-foreground text-foreground"
							: "border-transparent text-muted-foreground hover:text-foreground",
					)}
				>
					Code
				</button>
				{view === "code" ? (
					<div className="ml-auto">
						<CodeBlockCopy code={code} />
					</div>
				) : null}
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
				<div
					id="code-panel"
					role="tabpanel"
					data-shiki=""
					className="overflow-x-auto p-6 text-sm [&_pre]:!bg-transparent"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted server-rendered HTML
					dangerouslySetInnerHTML={{ __html: codeHtml }}
				/>
			)}
		</div>
	);
}
