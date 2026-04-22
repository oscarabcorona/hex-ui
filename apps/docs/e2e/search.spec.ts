import { expect, test } from "@playwright/test";

test.describe("⌘K search palette", () => {
	test("opens on meta+k, narrows on typed query, Enter navigates", async ({ page }) => {
		await page.goto("/docs/components/avatar");
		await page.keyboard.press("Meta+k");

		const dialog = page.getByRole("dialog", { name: /search components/i });
		await expect(dialog).toBeVisible();

		const input = dialog.getByPlaceholder("Search components…");
		await input.fill("but");

		// First result row in the dialog must be Button — anchor the regex to
		// avoid matching "copy button" or other button-named controls.
		const firstResult = dialog
			.getByRole("button", { name: /^Button\s/i })
			.first();
		await expect(firstResult).toBeVisible();

		// <mark> scoped to the dialog so highlights elsewhere on the page
		// (none today, but a future page could add them) can't false-positive.
		await expect(dialog.locator("mark").first()).toBeVisible();

		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/docs\/components\/button$/);
	});

	test("Esc closes the palette", async ({ page }) => {
		await page.goto("/docs");
		await page.keyboard.press("Meta+k");
		const dialog = page.getByRole("dialog", { name: /search components/i });
		await expect(dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
	});
});
