"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MegaMenu from "./MegaMenu";

type BaseMenuItem = {
	label: string;
};

type StandardMenuItem = BaseMenuItem & {
	href: string;
	type?: never;
};

type MegaMenuItem = BaseMenuItem & {
	type: "mega";
	sections: {
		title: string;
		items: {
			title: string;
			description: string;
			href: string;
		}[];
	}[];
};

type MenuItem = StandardMenuItem | MegaMenuItem;

export const MENU_ITEMS: MenuItem[] = [
	{
		label: "ホーム",
		href: "/",
	},
	{
		label: "プロフィール",
		type: "mega",
		sections: [
			{
				title: "経歴・スキル",
				items: [
					{
						title: "職務経歴",
						description: "これまでの実務経験と担当プロジェクト",
						href: "/profile#career",
					},
					{
						title: "スキルセット",
						description: "プログラミング言語やフレームワークのスキル一覧",
						href: "/profile#skills",
					},
					{
						title: "保有資格",
						description: "取得した技術資格と認定証",
						href: "/profile#qualifications",
					},
				],
			},
			{
				title: "その他",
				items: [
					{
						title: "お問い合わせ",
						description: "ご質問やお仕事のご依頼はこちら",
						href: "/profile#contact",
					},
				],
			},
		],
	},
	{
		label: "プロダクト",
		type: "mega",
		sections: [
			{
				title: "個人開発",
				items: [
					{
						title: "Tech Blog",
						description: "Next.jsで構築した技術ブログプラットフォーム",
						href: "/personal-projects/my-blog",
					},
					{
						title: "Code Snippets",
						description: "コードスニペット管理・共有ツール",
						href: "/personal-projects/code-snippets",
					},
					{
						title: "すべてのプロジェクト",
						description: "個人開発プロジェクトの一覧",
						href: "/personal-projects",
					},
				],
			},
		],
	},
	{
		label: "フリーランス",
		type: "mega",
		sections: [
			{
				title: "サービス",
				items: [
					{
						title: "フロントエンド開発",
						description: "モダンなWebアプリケーションの開発",
						href: "/work-with-me#services",
					},
					{
						title: "技術支援・コンサルティング",
						description: "技術選定やアーキテクチャ設計のサポート",
						href: "/work-with-me#consulting",
					},
				],
			},
			{
				title: "料金・契約",
				items: [
					{
						title: "料金プラン",
						description: "各種プランと料金体系について",
						href: "/work-with-me#pricing",
					},
					{
						title: "よくある質問",
						description: "契約形態や進め方について",
						href: "/work-with-me#faq",
					},
					{
						title: "お問い合わせ",
						description: "お仕事のご依頼・ご相談",
						href: "/work-with-me#contact",
					},
				],
			},
		],
	},
];

export default function Navigation() {
	const pathname = usePathname();

	return (
		<nav className="flex items-center gap-1">
			{MENU_ITEMS.map((item) => {
				const isActive = "href" in item && pathname === item.href;

				if ("type" in item && item.type === "mega") {
					return (
						<MegaMenu
							key={item.label}
							trigger={item.label}
							sections={item.sections}
							isActive={isActive}
						/>
					);
				}

				return (
					<Button
						key={item.href}
						variant="ghost"
						className={cn(isActive && "bg-accent")}
						asChild
					>
						<Link href={item.href}>{item.label}</Link>
					</Button>
				);
			})}
		</nav>
	);
}
