"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { popularComponents, search, type SearchResult } from "./search";

interface UseDocsSearchResult {
	open: boolean;
	setOpen: (open: boolean) => void;
	query: string;
	setQuery: (query: string) => void;
	highlighted: number;
	results: SearchResult[];
	suggestions: SearchResult[];
	showSuggestions: boolean;
	onInputKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onResultHover: (i: number) => void;
	navigate: (r: SearchResult) => void;
}

const MAX_RESULTS = 10;
const MAX_SUGGESTIONS = 5;

/**
 * Headless command-palette logic: open/close, query state, keyboard navigation,
 * and result derivation. Keeps the palette UI purely presentational — it
 * consumes the returned handlers and state, no hooks of its own.
 */
export function useDocsSearch(): UseDocsSearchResult {
	const [open, setOpenRaw] = useState(false);
	const [query, setQuery] = useState("");
	const [highlighted, setHighlighted] = useState(0);
	const router = useRouter();

	const results = useMemo(() => search(query, MAX_RESULTS), [query]);
	const suggestions = useMemo(() => popularComponents(MAX_SUGGESTIONS), []);
	const showSuggestions =
		query.trim().length > 0 && results.length === 0 && suggestions.length > 0;

	// ⌘K / Ctrl-K global toggle. Subscription-style effect, no setState antipattern.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpenRaw((v) => !v);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	const setOpen = (next: boolean) => {
		setOpenRaw(next);
		if (!next) {
			// Reset query/highlight as part of the close handler — no
			// derived-state-in-effect.
			setQuery("");
			setHighlighted(0);
		}
	};

	const setQueryAndResetHighlight = (next: string) => {
		setQuery(next);
		setHighlighted(0);
	};

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
			setHighlighted(
				(i) => (i - 1 + results.length) % Math.max(results.length, 1),
			);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const hit = results[highlighted];
			if (hit) navigate(hit);
		}
	};

	return {
		open,
		setOpen,
		query,
		setQuery: setQueryAndResetHighlight,
		highlighted,
		results,
		suggestions,
		showSuggestions,
		onInputKey,
		onResultHover: setHighlighted,
		navigate,
	};
}
