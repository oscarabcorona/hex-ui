/** External URLs used across the docs surface. Single source of truth. */
export const GITHUB_URL = "https://github.com/oscarabcorona/hex-core";

/** Base URL for "Edit this page" deep links into the GitHub web editor. */
export const GITHUB_EDIT_BASE = `${GITHUB_URL}/edit/main`;

/**
 * Build a GitHub web-editor URL for a repo-relative path. Throws on an empty
 * path so callers can't silently link to the repo root — the `EditOnGithub`
 * component short-circuits before hitting this, so reaching this branch is
 * a programmer error, not a user input.
 * @param repoRelativePath - Path from the repo root, e.g. `registry/items/button.json`
 * @returns Deep link into the GitHub editor on the main branch
 */
export function editUrl(repoRelativePath: string): string {
	const trimmed = repoRelativePath.replace(/^\/+/, "");
	if (trimmed.length === 0) {
		throw new Error("editUrl requires a non-empty repo-relative path");
	}
	return `${GITHUB_EDIT_BASE}/${trimmed}`;
}
