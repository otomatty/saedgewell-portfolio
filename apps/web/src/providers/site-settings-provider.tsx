"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "../hooks/use-toast";
import type { SiteSettings } from "../types/site-settings";
import { Button } from "../components/ui/button";

interface SiteSettingsContextType {
	settings: SiteSettings;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export function useSiteSettings() {
	const context = useContext(SiteSettingsContext);
	if (!context) {
		throw new Error(
			"useSiteSettings must be used within a SiteSettingsProvider",
		);
	}
	return context.settings;
}

interface SiteSettingsProviderProps {
	settings: SiteSettings;
	children: React.ReactNode;
}

/**
 * サイト設定プロバイダー
 * - 初期設定をグローバルステートに設定
 * - 設定の更新を監視
 * - 開発中の場合はトースト通知を表示
 */
export function SiteSettingsProvider({
	settings,
	children,
}: SiteSettingsProviderProps) {
	const { toast } = useToast();
	const pathname = usePathname();

	// 開発中バナーの表示
	useEffect(() => {
		// 管理画面では表示しない
		if (pathname?.startsWith("/admin")) return;

		// 開発中バナーが有効な場合のみ表示
		if (settings.isDevelopmentBannerEnabled) {
			const { dismiss } = toast({
				title: "開発中のお知らせ",
				description:
					"このサイトは現在開発中です。一部の機能やコンテンツが未完成の場合があります。",
				variant: "default",
				action: <Button onClick={() => dismiss()}>閉じる</Button>,
				duration: 10000, // 10秒間表示
			});

			return () => {
				dismiss();
			};
		}
	}, [settings.isDevelopmentBannerEnabled, pathname, toast]);

	return (
		<SiteSettingsContext.Provider value={{ settings }}>
			{children}
		</SiteSettingsContext.Provider>
	);
}
