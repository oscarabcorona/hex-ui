/**
 * One segment of a string, flagged whether it matches the highlight query.
 * Used by the search palette to render matched characters with a `<mark>`.
 */
export interface HighlightSegment {
	text: string;
	match: boolean;
}

/**
 * Split `text` into alternating match / non-match segments based on
 * `query`. Case-insensitive, no regex (plain indexOf) to avoid escape
 * pitfalls with special characters in user input.
 *
 * Empty query returns a single non-match segment containing the full text.
 *
 * @param text - The string to highlight
 * @param query - The needle (case-insensitive, whitespace-trimmed)
 * @returns Ordered segments the caller can map over
 */
export function highlightTokens(text: string, query: string): HighlightSegment[] {
	const needle = query.trim().toLowerCase();
	if (needle.length === 0 || text.length === 0) {
		return [{ text, match: false }];
	}

	const haystack = text.toLowerCase();
	const segments: HighlightSegment[] = [];
	let cursor = 0;

	while (cursor < text.length) {
		const hit = haystack.indexOf(needle, cursor);
		if (hit === -1) {
			segments.push({ text: text.slice(cursor), match: false });
			break;
		}
		if (hit > cursor) {
			segments.push({ text: text.slice(cursor, hit), match: false });
		}
		segments.push({ text: text.slice(hit, hit + needle.length), match: true });
		cursor = hit + needle.length;
	}

	return segments;
}
