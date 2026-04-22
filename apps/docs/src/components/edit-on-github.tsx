import { editUrl } from "../lib/links";

/**
 * "Edit this page on GitHub" link — used in the docs footer to let readers
 * jump into the web editor for the current page's source. `repoRelativePath`
 * is the path from the repo root (e.g. `registry/items/button.json` for a
 * component page, or `apps/docs/src/app/docs/installation/page.tsx` for a
 * standalone content page). Empty / whitespace-only paths render nothing.
 */
export function EditOnGithub({ repoRelativePath }: { repoRelativePath: string }) {
	if (repoRelativePath.trim().length === 0) return null;

	return (
		<a
			href={editUrl(repoRelativePath)}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1.5 rounded-md text-xs text-muted-foreground transition-all duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-4 w-4"
				aria-hidden="true"
			>
				<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
				<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
			</svg>
			Edit this page on GitHub
		</a>
	);
}
