import Link from "next/link";

interface Crumb {
	label: string;
	href?: string;
}

/**
 * Lightweight breadcrumb trail used on docs pages. The last crumb is plain
 * text (current page); earlier crumbs are links.
 */
export function DocsBreadcrumb({ trail }: { trail: Crumb[] }) {
	return (
		<nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
			<ol className="flex items-center gap-1.5">
				{trail.map((crumb, i) => {
					const isLast = i === trail.length - 1;
					return (
						<li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
							{crumb.href && !isLast ? (
								<Link
									href={crumb.href}
									className="transition-all duration-200 ease-out hover:text-foreground"
								>
									{crumb.label}
								</Link>
							) : (
								<span className={isLast ? "text-foreground" : undefined}>
									{crumb.label}
								</span>
							)}
							{!isLast ? <span aria-hidden="true">/</span> : null}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
