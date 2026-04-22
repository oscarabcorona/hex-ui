import { Fragment } from "react";
import { highlightTokens } from "../lib/highlight-tokens";

/**
 * Render `text` with the characters matching `query` wrapped in a `<mark>`.
 * Pure presentation — relies on `highlightTokens` for segmentation logic.
 * Server-safe.
 */
export function SearchHighlight({ text, query }: { text: string; query: string }) {
	const segments = highlightTokens(text, query);
	return (
		<>
			{segments.map((seg, i) =>
				seg.match ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are positional; order stable per render
					<mark
						key={i}
						className="rounded-sm bg-yellow-300/70 px-0.5 font-medium text-foreground dark:bg-yellow-500/30"
					>
						{seg.text}
					</mark>
				) : (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are positional; order stable per render
					<Fragment key={i}>{seg.text}</Fragment>
				),
			)}
		</>
	);
}
