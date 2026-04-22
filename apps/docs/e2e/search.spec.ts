import { expect, test } from "@playwright/test";

test.describe("⌘K search palette", () => {
	test("opens, narrows on typed query, Enter navigates", async ({ page }) => {
		await page.goto("/docs/components/avatar");

		// Click the search trigger (the chromium keyboard shortcut is flaky
		// across platforms; clicking the button always works).
		await page.getByRole("button", { name: /search components/i }).first().click();

		const input = page.getByPlaceholder("Search components…");
		await expect(input).toBeVisible();
		await input.fill("but");

		// First matching row — the resultlist is the nearest <ul aria-label="Search results">.
		const results = page.getByRole("list", { name: /search results/i });
		const firstResult = results.getByRole("button").first();
		await expect(firstResult).toBeVisible();
		await expect(firstResult).toContainText(/button/i);

		// <mark> is scoped to the results list so highlights elsewhere can't
		// false-positive.
		await expect(results.locator("mark").first()).toBeVisible();

		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/docs\/components\/button$/);
	});

	test("Esc closes the palette", async ({ page }) => {
		await page.goto("/docs");
		await page.getByRole("button", { name: /search components/i }).first().click();

		const input = page.getByPlaceholder("Search components…");
		await expect(input).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(input).toBeHidden();
	});
});
