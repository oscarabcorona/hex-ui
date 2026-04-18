"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarProvider,
	SidebarTrigger,
} from "../../components/ui";

/** Sidebar demo: collapsible app-shell with a toggle in the main area. */
export function SidebarDemo() {
	return (
		<div className="h-[320px] overflow-hidden rounded-lg border">
			<SidebarProvider className="min-h-0 h-full">
				<Sidebar>
					<SidebarHeader>
						<span className="font-semibold">Acme</span>
					</SidebarHeader>
					<SidebarContent>
						<SidebarItem active>Dashboard</SidebarItem>
						<SidebarItem>Projects</SidebarItem>
						<SidebarItem>Settings</SidebarItem>
					</SidebarContent>
					<SidebarFooter>
						<span className="text-xs text-muted-foreground">Signed in as jane</span>
					</SidebarFooter>
				</Sidebar>
				<main className="flex flex-1 flex-col gap-3 p-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<span className="text-sm font-medium">Toggle the sidebar</span>
					</div>
					<p className="text-sm text-muted-foreground">
						Click the toggle to collapse or expand the sidebar.
					</p>
				</main>
			</SidebarProvider>
		</div>
	);
}
