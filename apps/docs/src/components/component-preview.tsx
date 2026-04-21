"use client";

import { useState } from "react";
import { CodeBlockCopy } from "./code-block-copy";
import { cn } from "../lib/utils";

type View = "preview" | "code";

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
	const [view, setView] = useState<View>("preview");

	return (
		<div className="overflow-hidden rounded-lg border">
			<div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-2">
				<div
					role="tablist"
					aria-label="Preview or code"
					className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/50 p-0.5"
				>
					<TabButton view={view} target="preview" onSelect={setView}>
						Preview
					</TabButton>
					<TabButton view={view} target="code" onSelect={setView}>
						Code
					</TabButton>
				</div>
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
					className="overflow-x-auto p-4 font-mono text-sm [&_pre]:!bg-transparent"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted server-rendered HTML
					dangerouslySetInnerHTML={{ __html: codeHtml }}
				/>
			)}
		</div>
	);
}

/** Single tab button. Pill-style active state over the pinned tab-row background. */
function TabButton({
	view,
	target,
	onSelect,
	children,
}: {
	view: View;
	target: View;
	onSelect: (next: View) => void;
	children: React.ReactNode;
}) {
	const active = view === target;
	return (
		<button
			type="button"
			role="tab"
			aria-selected={active}
			aria-controls={target === "preview" ? "preview-panel" : "code-panel"}
			onClick={() => onSelect(target)}
			className={cn(
				"rounded-sm px-3 py-1 text-sm transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				active
					? "bg-background font-medium text-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground",
			)}
		>
			{children}
		</button>
	);
}
