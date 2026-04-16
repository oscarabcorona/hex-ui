"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

const navigation = [
	{
		title: "Getting Started",
		items: [
			{ title: "Introduction", href: "/docs/getting-started" },
			{ title: "Installation", href: "/docs/getting-started/installation" },
		],
	},
	{
		title: "Primitives",
		items: [
			{ title: "Button", href: "/docs/components/button" },
			{ title: "Input", href: "/docs/components/input" },
			{ title: "Textarea", href: "/docs/components/textarea" },
			{ title: "Label", href: "/docs/components/label" },
			{ title: "Checkbox", href: "/docs/components/checkbox" },
			{ title: "Switch", href: "/docs/components/switch" },
			{ title: "Badge", href: "/docs/components/badge" },
			{ title: "Separator", href: "/docs/components/separator" },
		],
	},
	{
		title: "Components",
		items: [
			{ title: "Card", href: "/docs/components/card" },
			{ title: "Tabs", href: "/docs/components/tabs" },
			{ title: "Accordion", href: "/docs/components/accordion" },
		],
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 md:block">
			<nav className="space-y-6">
				{navigation.map((group) => (
					<div key={group.title}>
						<h4 className="mb-2 px-3 text-sm font-semibold tracking-tight">{group.title}</h4>
						<ul className="space-y-0.5">
							{group.items.map((item) => (
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
				))}
			</nav>
		</aside>
	);
}
