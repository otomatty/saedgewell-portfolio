import { type Page, expect } from "@playwright/test";

export const checkSectionVisibility = async (
	page: Page,
	sectionName: string,
) => {
	const section = await page
		.getByRole("region")
		.filter({ hasText: new RegExp(sectionName, "i") });
	await expect(section).toBeVisible();
	return section;
};

export const checkHeadingVisibility = async (
	page: Page,
	headingText: string,
	level = 1,
) => {
	// アニメーションの完了を待つ
	await page.waitForTimeout(1000);

	const heading = page.getByRole("heading", {
		name: new RegExp(headingText.replace(/\s+/g, "\\s+"), "i"),
		level,
	});
	await expect(heading).toBeVisible();
	return heading;
};

export const checkLinkVisibility = async (page: Page, linkText: string) => {
	const link = page.getByRole("link", { name: new RegExp(linkText, "i") });
	await expect(link).toBeVisible();
	return link;
};

export const checkButtonVisibility = async (
	page: Page,
	buttonText: string,
	options: { parent?: "banner" | "main" | "contentinfo" } = {},
) => {
	const button = options.parent
		? page.getByRole(options.parent).locator("button", {
				hasText: new RegExp(buttonText, "i"),
			})
		: page.locator("button", {
				hasText: new RegExp(buttonText, "i"),
			});
	await expect(button).toBeVisible();
	await expect(button).toBeEnabled();
	return button;
};

export const checkNavigationItem = async (
	page: Page,
	itemText: string,
	options: { isButton?: boolean } = {},
) => {
	const item = options.isButton
		? page.locator("button", { hasText: new RegExp(itemText, "i") })
		: page.locator("a", { hasText: new RegExp(itemText, "i") });
	await expect(item).toBeVisible();
	return item;
};

export const checkNavigationLinks = async (
	page: Page,
	items: Array<string | { text: string; isButton?: boolean }>,
) => {
	for (const item of items) {
		if (typeof item === "string") {
			await checkNavigationItem(page, item);
		} else {
			await checkNavigationItem(page, item.text, { isButton: item.isButton });
		}
	}
};

export const setViewportSize = async (
	page: Page,
	size: "mobile" | "tablet" | "desktop",
) => {
	const sizes = {
		mobile: { width: 375, height: 667 },
		tablet: { width: 768, height: 1024 },
		desktop: { width: 1280, height: 800 },
	};
	await page.setViewportSize(sizes[size]);
};

export const checkMobileMenuVisibility = async (
	page: Page,
	shouldBeVisible: boolean,
) => {
	const mobileMenu = page.getByRole("button", { name: /menu/i });
	if (shouldBeVisible) {
		await expect(mobileMenu).toBeVisible();
	} else {
		await expect(mobileMenu).toBeHidden();
	}
	return mobileMenu;
};

export const waitForAnimation = async (page: Page, duration = 1000) => {
	await page.waitForTimeout(duration);
};

export const scrollToBottom = async (page: Page) => {
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await waitForAnimation(page);
};
