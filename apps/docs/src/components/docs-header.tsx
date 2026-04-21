import Link from "next/link";
import { DocsSearch } from "./docs-search";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/**
 * Docs header — sits at top of main content column on lg+ (right of fixed
 * sidebar), full-width on mobile. Hosts search (⌘K), theme toggle, GitHub
 * link, and a hamburger trigger for mobile navigation.
 */
export function DocsHeader() {
	return (
		<header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
			<div className="flex min-w-0 items-center gap-2 lg:hidden">
				<MobileNav />
				<Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Home">
					<span className="truncate text-base font-bold tracking-tight">Hex UI</span>
					<span className="shrink-0 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
						v0.1
					</span>
				</Link>
			</div>
			<div className="hidden flex-1 lg:block">
				<DocsSearch />
			</div>
			<div className="flex items-center gap-1 sm:gap-2">
				<div className="lg:hidden">
					<DocsSearch />
				</div>
				<ThemeToggle />
				<a
					href="https://github.com/oscarabcorona/hex-ui"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub repository"
					className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
						<path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02 0 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.57 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5Z" />
					</svg>
				</a>
			</div>
		</header>
	);
}
