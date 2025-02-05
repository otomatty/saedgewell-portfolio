import { test, expect } from "@playwright/test";
import {
	checkSectionVisibility,
	checkHeadingVisibility,
	checkNavigationLinks,
	setViewportSize,
	checkMobileMenuVisibility,
	checkButtonVisibility,
	checkLinkVisibility,
	checkNavigationItem,
} from "./helpers";

test.describe("トップページ", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("ページタイトルとメタ情報が正しく表示される", async ({ page }) => {
		await expect(page).toHaveTitle(/Saedgewell Portfolio/);

		// アニメーションの完了を待つ
		await page.waitForTimeout(1000);

		// ヘッディングの確認（部分一致で検証）
		const heading = page.getByRole("heading", { level: 1 });
		await expect(heading).toBeVisible();
		await expect(heading).toContainText("エンジニアリング");
		await expect(heading).toContainText("ビジネスの成功を実現する");
	});

	test("ヘッダーナビゲーションが正しく表示される", async ({ page }) => {
		// ヘッダーの存在確認
		const header = page.getByRole("banner");
		await expect(header).toBeVisible();

		// 主要なナビゲーションリンクの確認
		await checkNavigationLinks(page, [
			"About",
			"Works",
			{ text: "Services", isButton: true },
			"Blog",
			"Contact",
		]);

		// Servicesメニューの確認（ホバーで開く）
		const servicesMenu = await checkNavigationItem(page, "Services", {
			isButton: true,
		});
		await servicesMenu.hover();

		// アニメーションの完了を待つ
		await page.waitForTimeout(1000);

		// サブメニューの確認
		const subMenuLinks = [
			{
				text: "サービス一覧",
				href: "/services",
				description: "提供しているサービスの詳細をご確認いただけます。",
			},
			{
				text: "開発プロセス",
				href: "/services/process",
				description:
					"プロジェクトの進め方や各フェーズでの成果物について詳しくご説明します。",
			},
			{
				text: "料金",
				href: "/services/pricing",
				description: "各種成果物の料金体系をご確認いただけます。",
			},
			{
				text: "見積もり",
				href: "/services/estimate",
				description:
					"簡単な質問に答えるだけで、おおよその見積もり金額を算出できます。",
			},
		];

		// NavigationMenuContentを待つ
		const menuContent = page.locator('[data-state="open"]').filter({
			has: page.locator("[data-radix-navigation-menu-content]"),
		});
		await expect(menuContent).toBeVisible();

		// サブメニューアイテムの確認
		for (const { text, href, description } of subMenuLinks) {
			const menuItem = menuContent.locator(`a[href="${href}"]`);
			await expect(menuItem).toBeVisible();

			// タイトルと説明文を確認
			await expect(menuItem.locator("div.text-sm.font-medium")).toHaveText(
				text,
			);
			await expect(
				menuItem.locator("p.text-sm.text-muted-foreground"),
			).toHaveText(description);
		}
	});

	test("Heroセクションが正しく表示される", async ({ page }) => {
		// アニメーションの完了を待つ
		await page.waitForTimeout(1000);

		// メインヘッドラインの確認
		const heading = page.getByRole("heading", { level: 1 });
		await expect(heading).toBeVisible();
		await expect(heading).toContainText("エンジニアリング");
		await expect(heading).toContainText("ビジネスの成功を実現する");

		// お問い合わせボタンの確認（ヘッダー内）
		await checkButtonVisibility(page, "お問い合わせ", { parent: "banner" });

		// お問い合わせボタンの確認（メインコンテンツ内）
		await checkButtonVisibility(page, "お問い合わせ", { parent: "main" });
	});

	test("各セクションが正しく表示される", async ({ page }) => {
		// アニメーションの完了を待つ
		await page.waitForTimeout(1000);

		// スクロールしながら各セクションを確認
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// 各セクションの確認
		const sections = [
			"エンジニアリングでビジネスの成功を実現する",
			"プロダクトエンジニアとして、あなたのビジョンを現実に",
			"技術で価値を創造する",
		];

		for (const sectionText of sections) {
			const section = page.getByText(sectionText);
			await expect(section).toBeVisible();
		}
	});

	test("レスポンシブデザインが正しく機能する", async ({ page }) => {
		// デスクトップビューでテスト
		await setViewportSize(page, "desktop");
		await page.waitForTimeout(500);

		// デスクトップナビゲーションの確認
		const desktopNav = page.locator("nav.hidden.md\\:flex");
		await expect(desktopNav).toBeVisible();

		// Servicesメニューの確認（ホバーで開く）
		const servicesMenu = desktopNav.getByRole("button", { name: "Services" });
		await servicesMenu.hover();
		await page.waitForTimeout(1000);

		// サブメニューの確認
		const menuContent = page.locator('[data-state="open"]').filter({
			has: page.locator("[data-radix-navigation-menu-content]"),
		});
		await expect(menuContent).toBeVisible();

		// タブレットビューでテスト
		await setViewportSize(page, "tablet");
		await page.waitForTimeout(500);

		// デスクトップナビゲーションが表示されていることを確認
		await expect(desktopNav).toBeVisible();

		// モバイルメニューが非表示であることを確認
		const mobileMenu = page
			.getByRole("button")
			.filter({ hasText: "メニューを開く" });
		await expect(mobileMenu).not.toBeVisible();

		// モバイルビューでテスト
		await setViewportSize(page, "mobile");
		await page.waitForTimeout(500);

		// デスクトップナビゲーションが非表示であることを確認
		await expect(desktopNav).not.toBeVisible();

		// モバイルメニューが表示されていることを確認
		await expect(mobileMenu).toBeVisible();

		// モバイルメニューを開く
		await mobileMenu.click();
		await page.waitForTimeout(1000);

		// モバイルメニューの内容を確認
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();

		// Servicesボタンをクリック
		const servicesButton = dialog.getByRole("button", { name: "Services" });
		await expect(servicesButton).toBeVisible();
		await servicesButton.click();
		await page.waitForTimeout(500);

		// CollapsibleContentを待つ
		const collapsibleContent = dialog.locator('[data-state="open"]').filter({
			has: page.locator("[data-radix-collapsible-content]"),
		});
		await expect(collapsibleContent).toBeVisible();

		// サブメニューアイテムの確認
		const subMenuLinks = [
			{ text: "サービス一覧", href: "/services" },
			{ text: "開発プロセス", href: "/services/process" },
			{ text: "料金", href: "/services/pricing" },
			{ text: "見積もり", href: "/services/estimate" },
		];

		for (const { text, href } of subMenuLinks) {
			const link = collapsibleContent.locator(`a[href="${href}"]`);
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute("href", href);
		}
	});

	test("アニメーションとインタラクションが正しく機能する", async ({ page }) => {
		// アニメーションの完了を待つ
		await page.waitForTimeout(1000);

		// ヘッダーのアニメーション確認
		const header = page.getByRole("banner");
		await expect(header).toBeVisible();

		// Heroセクションのアニメーション確認
		const heroHeading = page.getByRole("heading", { level: 1 });
		await expect(heroHeading).toBeVisible();

		// スクロールによるアニメーションの確認
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(1000);

		// フッターの表示確認
		const footer = page.getByRole("contentinfo");
		await expect(footer).toBeVisible();

		// ボタンのホバーエフェクト確認
		const projectButton = page.getByRole("button", {
			name: /プロジェクトを見る/i,
		});
		await projectButton.hover();
		await page.waitForTimeout(500);
	});

	test("モバイルメニューが正しく動作すること", async ({ page }) => {
		// ビューポートをモバイルサイズに設定
		await page.setViewportSize({ width: 375, height: 667 });

		// トップページに移動
		await page.goto("/");

		// メニューボタンをクリック
		const menuButton = page
			.getByRole("button")
			.filter({ hasText: "メニューを開く" });
		await expect(menuButton).toBeVisible();
		await menuButton.click();

		// アニメーションの完了を待つ
		await page.waitForTimeout(500);

		// メニューが表示されるまで待機
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();

		// サブメニューの確認（モバイルでは直接表示）
		const subMenuLinks = [
			{
				text: "サービス一覧",
				href: "/services",
			},
			{
				text: "開発プロセス",
				href: "/services/process",
			},
			{
				text: "料金",
				href: "/services/pricing",
			},
			{
				text: "見積もり",
				href: "/services/estimate",
			},
		];

		for (const { text, href } of subMenuLinks) {
			const link = dialog.getByRole("link", { name: text });
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute("href", href);
		}

		// その他のナビゲーションリンクの確認
		const navigationLinks = [
			{
				text: "About",
				href: "/about",
			},
			{
				text: "Works",
				href: "/works",
			},
			{
				text: "Blog",
				href: "/blog",
			},
			{
				text: "Contact",
				href: "/contact",
			},
		];

		for (const { text, href } of navigationLinks) {
			const link = dialog.getByRole("link", { name: text });
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute("href", href);
		}
	});
});
