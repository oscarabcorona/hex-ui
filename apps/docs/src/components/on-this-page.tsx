/**
 * Right-rail "On This Page" table of contents with in-page anchor links.
 * @param sections - Heading metadata: each section's DOM id and display title
 */
export function OnThisPage({ sections }: { sections: { id: string; title: string }[] }) {
	return (
		<aside
			aria-label="On this page"
			className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-48 shrink-0 overflow-y-auto py-6 pl-4 xl:block"
		>
			<h4 className="mb-3 text-sm font-semibold">On This Page</h4>
			<ul className="space-y-1.5">
				{sections.map((section) => (
					<li key={section.id}>
						<a
							href={`#${section.id}`}
							className="block text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
						>
							{section.title}
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
