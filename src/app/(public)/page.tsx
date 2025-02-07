import { Hero } from "./_components/Hero";
import { Introduction } from "./_components/Introduction";
import { Achievements } from "./_components/Achievements";
import { CTASection } from "./_components/CTASection";
import type { FeaturedWork } from "@/types/work";

// TODO: 実際のデータ取得処理に置き換える
const mockWorks: FeaturedWork[] = [
	{
		id: "1",
		title: "企業向けSaaSプラットフォーム",
		description: "大規模なSaaSプラットフォームの開発",
		thumbnail_url: "/images/works/work-1.jpg",
	},
	{
		id: "2",
		title: "ECサイトリニューアル",
		description: "大手ECサイトのフルリニューアル",
		thumbnail_url: "/images/works/work-2.jpg",
	},
	{
		id: "3",
		title: "スマートファクトリー管理システム",
		description: "IoTセンサーを活用した工場管理システム",
		thumbnail_url: "/images/works/work-3.jpg",
	},
	{
		id: "4",
		title: "医療機関向け予約システム",
		description: "オンライン診療・予約システムの開発",
		thumbnail_url: "/images/works/work-4.jpg",
	},
	{
		id: "5",
		title: "フィンテックアプリケーション",
		description: "ブロックチェーンを活用した決済システム",
		thumbnail_url: "/images/works/work-5.jpg",
	},
];

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<Hero />
			<Introduction />
			<Achievements works={mockWorks} />
			<CTASection />
		</div>
	);
}
