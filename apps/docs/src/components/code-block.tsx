/**
 * A syntax-highlighted code block with an optional language label header.
 * @param code - The code to display
 * @param label - Optional language/tool label shown in the header
 */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
	return (
		<div className="rounded-lg border">
			{label && (
				<div className="flex items-center border-b bg-muted/50 px-4 py-2">
					<span className="text-xs font-medium text-muted-foreground">{label}</span>
				</div>
			)}
			<pre className="overflow-x-auto p-4 text-sm">
				<code>{code}</code>
			</pre>
		</div>
	);
}
