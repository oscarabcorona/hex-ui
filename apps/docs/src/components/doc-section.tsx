import type { ReactNode } from "react";

/**
 * Docs-content `<section>` wrapper — provides the scroll-offset, heading
 * rhythm, and vertical spacing used across every DocsPage-based page.
 */
export function DocSection({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<section id={id} className="scroll-mt-20 space-y-3">
			<h2 className="text-xl font-semibold">{title}</h2>
			{children}
		</section>
	);
}

/** Inline code token styled consistently across all prose. */
export function InlineCode({ children }: { children: ReactNode }) {
	return (
		<code className="rounded bg-muted px-1.5 py-0.5 text-xs">{children}</code>
	);
}
