"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { Sidebar } from "./sidebar";

/**
 * Mobile navigation slide-in. Hamburger trigger opens a full-height Dialog
 * panel that mirrors the desktop Sidebar. The panel closes on any anchor
 * click inside it (via event delegation on the panel) so the menu doesn't
 * linger after the user picks a page.
 */
export function MobileNav() {
	const [open, setOpen] = useState(false);

	const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target instanceof Element && e.target.closest("a[href]")) {
			setOpen(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Open navigation menu"
				className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
					<line x1="4" y1="6" x2="20" y2="6" />
					<line x1="4" y1="12" x2="20" y2="12" />
					<line x1="4" y1="18" x2="20" y2="18" />
				</svg>
			</button>

			<Dialog
				open={open}
				onClose={setOpen}
				aria-label="Navigation menu"
				className="relative z-50 lg:hidden"
			>
				<DialogBackdrop className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
				<div className="fixed inset-0 flex">
					<DialogPanel
						onClick={handlePanelClick}
						className="flex h-full w-72 max-w-[80vw] flex-col overflow-y-auto border-r bg-background px-6 pt-4 pb-8"
					>
						<div className="mb-6 flex items-center justify-between">
							<BrandMark size="sm" />
							<button
								type="button"
								onClick={() => setOpen(false)}
								aria-label="Close navigation"
								className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
						</div>
						<Sidebar />
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}
