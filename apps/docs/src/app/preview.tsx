"use client";

import { useState } from "react";

export function Preview({
	title,
	description,
	children,
	code,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
	code: string;
}) {
	const [showCode, setShowCode] = useState(false);

	return (
		<div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md">
			<div className="flex items-center justify-between border-b px-6 py-4">
				<div>
					<h3 className="text-lg font-semibold">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				<button
					onClick={() => setShowCode(!showCode)}
					className="rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
				>
					{showCode ? "Preview" : "Code"}
				</button>
			</div>
			<div className="p-6">
				{showCode ? (
					<pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
						<code>{code}</code>
					</pre>
				) : (
					<div className="flex flex-wrap items-center gap-4">{children}</div>
				)}
			</div>
		</div>
	);
}
