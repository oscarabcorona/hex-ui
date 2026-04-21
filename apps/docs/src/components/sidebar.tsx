"use client";

import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { CATEGORY_LABELS, CATEGORY_ORDER, componentsByCategory } from "../lib/registry";

const GETTING_STARTED = [{ title: "Introduction", href: "/docs/getting-started" }];

/**
 * Docs sidebar navigation. Category groups derive from the registry so new
 * components show up automatically. Framer Motion's LayoutGroup + layoutId
 * animate the active-item indicator between routes.
 */
export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const groups = componentsByCategory();
	const orderedCategories = CATEGORY_ORDER.filter((c) => groups[c]);

	return (
		<LayoutGroup id="sidebar-active">
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
		</LayoutGroup>
	);
}

/** A titled group of sidebar links with an animated active indicator. */
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
			<div className="mb-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
				{title}
			</div>
			<ul className="relative space-y-px border-l border-border/60">
				{items.map((item) => {
					const isActive = pathname === item.href;
					return (
						<li key={item.href} className="relative">
							{isActive && (
								<motion.span
									layoutId="active-indicator"
									initial={false}
									aria-hidden="true"
									className="absolute -left-px top-0 bottom-0 w-px bg-foreground"
									transition={{ type: "spring", stiffness: 500, damping: 40 }}
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
