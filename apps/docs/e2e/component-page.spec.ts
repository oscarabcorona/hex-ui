import { expect, test } from "@playwright/test";

test.describe("component page", () => {
	test("Preview/Code tabs + copy button", async ({ page }) => {
		await page.goto("/docs/components/button");

		const codeTab = page.getByRole("tab", { name: "Code" });
		await expect(codeTab).toBeVisible();
		await codeTab.click();

		// Shiki-highlighted content has [data-shiki] wrapper.
		await expect(page.locator("[data-shiki]").first()).toBeVisible();

		const copyButton = page.getByRole("button", { name: /copy code/i }).first();
		await expect(copyButton).toBeVisible();
	});

	test("edit on github link present in footer", async ({ page }) => {
		await page.goto("/docs/components/button");
		const editLink = page.getByRole("link", { name: /edit this page on github/i });
		await expect(editLink).toBeVisible();
		const href = await editLink.getAttribute("href");
		expect(href).toContain(
			"github.com/oscarabcorona/hex-ui/edit/main/registry/items/button.json",
		);
	});
});

/*
 * TOC rail is `xl:block` only. Use test.use() to pin the viewport BEFORE
 * goto so the initial layout includes the TOC — avoids a resize-mid-test
 * race.
 */
test.describe("component page (xl viewport)", () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test("TOC click updates the hash", async ({ page }) => {
		await page.goto("/docs/components/button");
		const apiLink = page.locator(
			'aside[aria-label="On this page"] a[href="#api-reference"]',
		);
		await expect(apiLink).toBeVisible();
		await apiLink.click();
		await expect(page).toHaveURL(/#api-reference$/);
	});
});
