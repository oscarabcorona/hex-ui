import { Sidebar } from "../../components/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto flex max-w-7xl">
			<Sidebar />
			<div className="flex-1 min-w-0">{children}</div>
		</div>
	);
}
