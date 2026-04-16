"use client";

import { useState } from "react";
import { cn } from "../lib/utils";

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
			<div className="flex items-center border-b px-4">
				<button
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
				<div className="flex min-h-[200px] items-center justify-center p-8">{children}</div>
			) : (
				<pre className="overflow-x-auto p-6 text-sm">
					<code>{code}</code>
				</pre>
			)}
		</div>
	);
}
