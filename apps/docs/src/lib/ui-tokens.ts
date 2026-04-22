/**
 * Shared UI class strings and token constants for the docs surface. Single
 * source of truth — any chrome that reads "the article body max-width" or
 * "the Shiki theme pair" imports from here.
 */

/** Article-body max-width wrapper. Caps measure at ~65ch on ultra-wide. */
export const DOCS_CONTENT_WRAPPER = "mx-auto max-w-3xl xl:max-w-4xl";

/**
 * Shiki dual-theme pair. Light stays on `github-light`; dark uses
 * `github-dark-dimmed` because it's lower-saturation and reads better on our
 * zinc background than plain `github-dark`.
 */
export const SHIKI_THEMES = {
	light: "github-light",
	dark: "github-dark-dimmed",
} as const;
