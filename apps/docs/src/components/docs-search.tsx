"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useDocsSearch } from "../lib/use-docs-search";
import type { SearchResult } from "../lib/search";

/**
 * Global command palette. Pure presentation — all logic lives in
 * `useDocsSearch`. Keyboard-first: ⌘K opens, arrows traverse, Enter navigates,
 * Esc closes.
 */
export function DocsSearch() {
	const s = useDocsSearch();

	return (
		<>
			<button
				type="button"
				onClick={() => s.setOpen(true)}
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
				open={s.open}
				onClose={s.setOpen}
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
								value={s.query}
								onChange={(e) => s.setQuery(e.target.value)}
								onKeyDown={s.onInputKey}
								placeholder="Search components…"
								className="flex h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
								aria-label="Search query"
							/>
							<kbd className="ml-2 hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
								ESC
							</kbd>
						</div>
						{s.showSuggestions ? (
							<EmptyStateSuggestions
								query={s.query.trim()}
								suggestions={s.suggestions}
								onPick={s.navigate}
							/>
						) : null}
						<ul className="max-h-80 overflow-y-auto p-1" aria-label="Search results">
							{s.results.map((r, i) => (
								<ResultRow
									key={r.name}
									result={r}
									highlighted={i === s.highlighted}
									onHover={() => s.onResultHover(i)}
									onPick={() => s.navigate(r)}
								/>
							))}
						</ul>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}

/** Empty-state "try one of these" chip list. */
function EmptyStateSuggestions({
	query,
	suggestions,
	onPick,
}: {
	query: string;
	suggestions: SearchResult[];
	onPick: (r: SearchResult) => void;
}) {
	return (
		<div className="px-3 pt-3 pb-1">
			<p className="text-xs text-muted-foreground">
				No results for {`"${query}"`}. Try one of these:
			</p>
			<ul className="mt-2 flex flex-wrap gap-1.5">
				{suggestions.map((s) => (
					<li key={s.name}>
						<button
							type="button"
							onClick={() => onPick(s)}
							className="inline-flex items-center rounded-md border px-2 py-1 text-xs text-foreground transition-all duration-200 ease-out hover:bg-accent"
						>
							{s.displayName}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

/** One result row in the palette. */
function ResultRow({
	result,
	highlighted,
	onHover,
	onPick,
}: {
	result: SearchResult;
	highlighted: boolean;
	onHover: () => void;
	onPick: () => void;
}) {
	return (
		<li>
			<button
				type="button"
				onClick={onPick}
				onMouseEnter={onHover}
				className={`flex w-full flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left transition-all duration-200 ease-out ${
					highlighted ? "bg-accent text-accent-foreground" : "text-foreground"
				}`}
			>
				<span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
					<span>{result.displayName}</span>
					<span className="text-[10px] uppercase tracking-wide text-muted-foreground">
						{result.category}
					</span>
				</span>
				<span className="line-clamp-1 text-xs text-muted-foreground">
					{result.description}
				</span>
			</button>
		</li>
	);
}
