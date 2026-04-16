"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { componentsByCategory } from "../lib/registry";

const GETTING_STARTED = [{ title: "Introduction", href: "/docs/getting-started" }];

const CATEGORY_LABELS: Record<string, string> = {
	primitive: "Primitives",
	component: "Components",
	block: "Blocks",
	hook: "Hooks",
};

/**
 * Sidebar navigation for the docs app.
 * Component groups are derived from the registry — no hand-maintained lists.
 */
export function Sidebar() {
	const pathname = usePathname();
	const groups = componentsByCategory();
	const orderedCategories = ["primitive", "component", "block", "hook"].filter((c) => groups[c]);

	return (
		<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 md:block">
			<nav className="space-y-6" aria-label="Docs sidebar">
				<NavGroup title="Getting Started" items={GETTING_STARTED} pathname={pathname} />
				{orderedCategories.map((category) => (
					<NavGroup
						key={category}
						title={CATEGORY_LABELS[category] ?? category}
						items={groups[category].map((item) => ({
							title: item.displayName,
							href: `/docs/components/${item.name}`,
						}))}
						pathname={pathname}
					/>
				))}
			</nav>
		</aside>
	);
}

/** A titled group of sidebar links with active-state highlighting. */
function NavGroup({
	title,
	items,
	pathname,
}: {
	title: string;
	items: { title: string; href: string }[];
	pathname: string;
}) {
	return (
		<div>
			<h4 className="mb-2 px-3 text-sm font-semibold tracking-tight">{title}</h4>
			<ul className="space-y-0.5">
				{items.map((item) => (
					<li key={item.href}>
						<Link
							href={item.href}
							className={cn(
								"block rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
								pathname === item.href
									? "bg-accent font-medium text-accent-foreground"
									: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
							)}
						>
							{item.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
