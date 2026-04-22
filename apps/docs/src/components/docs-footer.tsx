import Link from "next/link";
import { GETTING_STARTED_CATEGORY, GETTING_STARTED_NAV } from "../lib/docs-nav";
import { CATEGORY_LABELS, CATEGORY_ORDER, componentsByCategory } from "../lib/registry";
import { EditOnGithub } from "./edit-on-github";

interface FooterLink {
	title: string;
	category: string;
	href: string;
}

function buildOrderedList(): FooterLink[] {
	const items: FooterLink[] = GETTING_STARTED_NAV.map((link) => ({
		title: link.title,
		category: GETTING_STARTED_CATEGORY,
		href: link.href,
	}));
	const groups = componentsByCategory();
	for (const category of CATEGORY_ORDER) {
		const group = groups[category];
		if (!group) continue;
		for (const item of group) {
			items.push({
				title: item.displayName,
				category: CATEGORY_LABELS[category] ?? category,
				href: `/docs/components/${item.name}`,
			});
		}
	}
	return items;
}

/** Static ordered doc-list built once at module load — registry is JSON at build time. */
const ORDERED_LIST: readonly FooterLink[] = buildOrderedList();

/**
 * Docs page footer — shows "Previous" / "Next" navigation derived from the
 * ordered sidebar list, plus an optional "Edit this page on GitHub" link
 * when the caller supplies `editPath`. Either prev or next can be null at
 * the edges of the list.
 */
export function DocsFooter({
	pathname,
	editPath,
}: {
	pathname: string;
	editPath?: string;
}) {
	const index = ORDERED_LIST.findIndex((i) => i.href === pathname);
	const prev = index > 0 ? ORDERED_LIST[index - 1] : null;
	const next = index >= 0 && index < ORDERED_LIST.length - 1 ? ORDERED_LIST[index + 1] : null;

	if (!prev && !next && !editPath) return null;

	return (
		<div className="mt-16 border-t pt-8">
			{editPath ? (
				<div className="mb-6">
					<EditOnGithub repoRelativePath={editPath} />
				</div>
			) : null}
			{prev || next ? (
				<nav
					aria-label="Page navigation"
					className="grid grid-cols-1 gap-3 sm:grid-cols-2"
				>
					{prev ? (
						<Link
							href={prev.href}
							className="group flex flex-col items-start gap-1 rounded-lg border px-4 py-3 transition-all duration-200 ease-out hover:bg-accent"
						>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
									<polyline points="15 18 9 12 15 6" />
								</svg>
								Previous
							</span>
							<span className="text-sm font-medium text-foreground">{prev.title}</span>
							<span className="text-xs text-muted-foreground">{prev.category}</span>
						</Link>
					) : (
						<div />
					)}
					{next ? (
						<Link
							href={next.href}
							className="group flex flex-col items-end gap-1 rounded-lg border px-4 py-3 text-right transition-all duration-200 ease-out hover:bg-accent sm:col-start-2"
						>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								Next
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</span>
							<span className="text-sm font-medium text-foreground">{next.title}</span>
							<span className="text-xs text-muted-foreground">{next.category}</span>
						</Link>
					) : null}
				</nav>
			) : null}
		</div>
	);
}
