import Link from "next/link";
import type { ReactNode } from "react";
import { DocsHeader } from "./docs-header";
import { Sidebar } from "./sidebar";

/**
 * Protocol-style docs shell. Fixed sidebar on lg+ (72/80 rem), main content
 * shifts right to clear it. Mobile falls back to a single scrollable column;
 * the slide-in mobile nav lands in Phase E.
 */
export function DocsShell({ children }: { children: ReactNode }) {
	return (
		<div className="h-full lg:ml-72 xl:ml-80">
			<div className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
				<aside className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-border/60 lg:bg-background lg:px-6 lg:pt-4 lg:pb-8 xl:w-80">
					<div className="hidden lg:flex">
						<Link href="/" className="flex items-center gap-2" aria-label="Home">
							<span className="text-lg font-bold tracking-tight">Hex UI</span>
							<span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
								v0.1
							</span>
						</Link>
					</div>
					<Sidebar className="hidden lg:mt-10 lg:block" />
				</aside>
			</div>
			<div className="relative flex h-full flex-col">
				<DocsHeader />
				<main className="flex-auto">{children}</main>
			</div>
		</div>
	);
}
