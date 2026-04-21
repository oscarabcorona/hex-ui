import { DocsShell } from "../../components/docs-shell";

/** Docs section layout — delegates to DocsShell for sidebar + header chrome. */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return <DocsShell>{children}</DocsShell>;
}
