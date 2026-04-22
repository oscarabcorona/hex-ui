import type { ReactNode } from "react";
import { DOCS_CONTENT_WRAPPER } from "../lib/ui-tokens";
import { DocsBreadcrumb, type Crumb } from "./docs-breadcrumb";
import { DocsFooter } from "./docs-footer";
import { OnThisPage, type TocSection } from "./on-this-page";
import { OnThisPageCompact } from "./on-this-page-compact";

/** Shape accepted by the shared `DocsPage` chrome component. */
interface DocsPageProps {
	/** Current pathname, used by DocsFooter to locate prev/next. */
	pathname: string;
	/** Visible page title (also becomes the last breadcrumb). */
	title: string;
	/** One-line intro shown under the title. */
	description: string;
	/** Additional breadcrumb links between "Docs" and the current page. */
	crumbs?: readonly Crumb[];
	/** Ordered sections for the right-rail TOC. */
	sections: readonly TocSection[];
	/** Repo-relative source path for the "Edit on GitHub" link. */
	editPath?: string;
	children: ReactNode;
}

/**
 * Shared chrome for standalone docs content pages (installation, theming, mcp,
 * faq, intro). Handles breadcrumb, heading block, right-rail TOC, and prev/next
 * footer so each content page can focus on prose.
 */
export function DocsPage({
	pathname,
	title,
	description,
	crumbs,
	sections,
	editPath,
	children,
}: DocsPageProps) {
	const trail: Crumb[] = [
		{ label: "Docs", href: "/docs" },
		...(crumbs ?? []),
		{ label: title },
	];

	return (
		<div className="flex">
			<main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
				<div className={DOCS_CONTENT_WRAPPER}>
					<DocsBreadcrumb trail={trail} />
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
						<p className="mt-2 text-lg text-muted-foreground">{description}</p>
					</div>

					<OnThisPageCompact sections={sections} className="mb-6" />

					<div className="space-y-10">{children}</div>

					<DocsFooter pathname={pathname} editPath={editPath} />
				</div>
			</main>
			<OnThisPage sections={sections} />
		</div>
	);
}
