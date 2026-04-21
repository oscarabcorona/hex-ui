"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { popularComponents, search, type SearchResult } from "../lib/search";

/**
 * Global command palette. Keyboard-first: ⌘K / Ctrl-K opens it, arrow keys
 * traverse results, Enter navigates, Esc closes. On narrow viewports the
 * trigger collapses to an icon button; on lg+ it expands into a full-width
 * search bar with label and ⌘K hint.
 */
export function DocsSearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [highlighted, setHighlighted] = useState(0);
	const router = useRouter();

	const results = useMemo(() => search(query, 10), [query]);
	const suggestions = useMemo(() => popularComponents(5), []);
	const showSuggestions =
		query.trim().length > 0 && results.length === 0 && suggestions.length > 0;

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		if (!open) {
			setQuery("");
			setHighlighted(0);
		}
	}, [open]);

	useEffect(() => {
		setHighlighted(0);
	}, [query]);

	const navigate = (r: SearchResult) => {
		setOpen(false);
		router.push(r.href);
	};

	const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlighted((i) => (i + 1) % Math.max(results.length, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlighted((i) => (i - 1 + results.length) % Math.max(results.length, 1));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const hit = results[highlighted];
			if (hit) navigate(hit);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-8 lg:w-full lg:max-w-sm lg:justify-between lg:gap-2 lg:border lg:border-input lg:bg-background lg:px-3 lg:text-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lg:hidden" aria-hidden="true">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<span className="hidden items-center gap-2 lg:flex">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					Search components
				</span>
				<kbd className="hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
					⌘K
				</kbd>
				<span className="sr-only lg:hidden">Search components</span>
			</button>

			<Dialog
				open={open}
				onClose={setOpen}
				aria-label="Search components"
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
				<div className="fixed inset-0 flex items-start justify-center p-4 sm:pt-[20vh]">
					<DialogPanel className="w-full max-w-xl overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg">
						<div className="flex items-center border-b px-3">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true">
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<input
								// biome-ignore lint/a11y/noAutofocus: command palette input is expected to grab focus on open
								autoFocus
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={onInputKey}
								placeholder="Search components…"
								className="flex h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
								aria-label="Search query"
							/>
							<kbd className="ml-2 hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
								ESC
							</kbd>
						</div>
						{showSuggestions ? (
							<div className="px-3 pt-3 pb-1">
								<p className="text-xs text-muted-foreground">
									No results for "{query.trim()}". Try one of these:
								</p>
								<ul className="mt-2 flex flex-wrap gap-1.5">
									{suggestions.map((s) => (
										<li key={s.name}>
											<button
												type="button"
												onClick={() => navigate(s)}
												className="inline-flex items-center rounded-md border px-2 py-1 text-xs text-foreground transition-all duration-200 ease-out hover:bg-accent"
											>
												{s.displayName}
											</button>
										</li>
									))}
								</ul>
							</div>
						) : null}
						<ul className="max-h-80 overflow-y-auto p-1" aria-label="Search results">
							{results.map((r, i) => (
								<li key={r.name}>
									<button
										type="button"
										onClick={() => navigate(r)}
										onMouseEnter={() => setHighlighted(i)}
										className={`flex w-full flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left transition-all duration-200 ease-out ${
											i === highlighted
												? "bg-accent text-accent-foreground"
												: "text-foreground"
										}`}
									>
										<span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
											<span>{r.displayName}</span>
											<span className="text-[10px] uppercase tracking-wide text-muted-foreground">
												{r.category}
											</span>
										</span>
										<span className="line-clamp-1 text-xs text-muted-foreground">
											{r.description}
										</span>
									</button>
								</li>
							))}
						</ul>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}
