import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { DocsHeader } from "./docs-header";
import { Sidebar } from "./sidebar";

/**
 * Docs chrome shell. Fixed sidebar on lg+ (72/80 rem), main content shifts
 * right to clear it. Mobile falls back to a single scrollable column with the
 * slide-in MobileNav triggered from the header.
 */
export function DocsShell({ children }: { children: ReactNode }) {
	return (
		<div className="h-full lg:ml-72 xl:ml-80">
			<div className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
				<aside className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-border/60 lg:bg-background lg:px-6 lg:pt-4 lg:pb-8 xl:w-80">
					<div className="hidden lg:flex">
						<BrandMark size="lg" />
					</div>
					<Sidebar className="hidden lg:mt-10 lg:block" />
				</aside>
			</div>
			<div className="relative flex h-full flex-col">
				<DocsHeader />
				<div className="flex-auto">{children}</div>
			</div>
		</div>
	);
}
