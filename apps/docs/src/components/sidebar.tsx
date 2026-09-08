"use client";

import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@hex-core/components/utils";
import { GETTING_STARTED_NAV } from "../lib/docs-nav";
import {
	CATEGORY_LABELS,
	CATEGORY_ORDER,
	componentsByCategory,
	listComponents,
	listNativeComponents,
	type RegistryIndexItem,
} from "../lib/registry";

interface SidebarCategory {
	key: string;
	title: string;
	items: RegistryIndexItem[];
}

/**
 * Group a platform's catalog into ordered sidebar sections.
 * @param items - The catalog to group, web or native
 * @returns Categories in display order, empty ones dropped
 */
function orderedSidebarCategories(items: readonly RegistryIndexItem[]): SidebarCategory[] {
	const groups = componentsByCategory(items);
	const ordered: SidebarCategory[] = [];
	for (const key of CATEGORY_ORDER) {
		const inCategory = groups[key];
		if (!inCategory) continue;
		ordered.push({ key, title: CATEGORY_LABELS[key] ?? key, items: inCategory });
	}
	return ordered;
}

/**
 * Docs sidebar navigation. Category groups derive from the registry so new
 * components show up automatically. Framer Motion's LayoutGroup + layoutId
 * animate the active-item indicator between routes.
 */
export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	// The two catalogs share category names, so showing both at once would
	// list "Button" twice under "Primitives" with no way to tell which
	// renders where. The section you are in picks the catalog instead.
	const isNative = pathname.startsWith("/native");
	const categories = orderedSidebarCategories(isNative ? listNativeComponents() : listComponents());
	const hrefFor = (name: string) => (isNative ? `/native/${name}` : `/docs/components/${name}`);

	return (
		<LayoutGroup id="sidebar-active">
			<nav className={cn("space-y-6", className)} aria-label="Docs sidebar">
				<NavGroup title="Getting Started" items={GETTING_STARTED_NAV} pathname={pathname} />
				{categories.map((c) => (
					<NavGroup
						key={c.key}
						title={isNative ? `React Native — ${c.title}` : c.title}
						items={c.items.map((item) => ({
							title: item.displayName,
							href: hrefFor(item.name),
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
	items: readonly { title: string; href: string }[];
	pathname: string;
}) {
	return (
		<div>
			<div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
				{title}
			</div>
			<ul className="relative border-l border-border/60">
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
									"block py-1.5 pl-4 pr-3 text-sm transition-all duration-200 ease-out",
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
