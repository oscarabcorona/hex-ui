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
 * Docs sidebar navigation. Category groups derive from the registry so new
 * components show up automatically. Positioning (sticky, overflow, width) is
 * handled by the parent DocsShell — this component is pure content.
 */
export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const groups = componentsByCategory();
	const orderedCategories = ["primitive", "component", "block", "hook"].filter((c) => groups[c]);

	return (
		<nav className={cn("space-y-8", className)} aria-label="Docs sidebar">
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
			<h2 className="mb-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
				{title}
			</h2>
			<ul className="space-y-px border-l border-border/60">
				{items.map((item) => {
					const isActive = pathname === item.href;
					return (
						<li key={item.href} className="relative">
							{isActive && (
								<span
									aria-hidden="true"
									className="absolute -left-px top-0 bottom-0 w-px bg-foreground"
								/>
							)}
							<Link
								href={item.href}
								className={cn(
									"block py-1 pl-4 pr-3 text-sm transition-all duration-200 ease-out",
									isActive
										? "font-medium text-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{item.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
