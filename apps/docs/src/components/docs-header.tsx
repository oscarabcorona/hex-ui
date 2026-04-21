import { BrandMark } from "./brand-mark";
import { DocsSearch } from "./docs-search";
import { GithubLink } from "./github-link";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/**
 * Docs header — sits at top of main content column on lg+ (right of fixed
 * sidebar), full-width on mobile. Hosts search (⌘K), theme toggle, GitHub
 * link, and a hamburger trigger for mobile navigation.
 */
export function DocsHeader() {
	return (
		<header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/90 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-6 lg:gap-4 lg:px-8">
			<div className="flex min-w-0 items-center gap-2 lg:hidden">
				<MobileNav />
				<BrandMark size="sm" />
			</div>
			<div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0 lg:w-full">
				<DocsSearch />
				<div className="hidden lg:block lg:flex-1" aria-hidden="true" />
				<ThemeToggle />
				<GithubLink />
			</div>
		</header>
	);
}
