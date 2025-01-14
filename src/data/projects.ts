import type { Product } from "@/types";

export const PROJECTS = [
	{
		id: "portfolio-site",
		title: "ポートフォリオサイト",
		summary: "Next.js と Tailwind CSS で作成した個人ポートフォリオサイト",
		thumbnailUrl: "/images/projects/portfolio.jpg",
		type: "web" as const,
		isPublic: true,
		description:
			"Next.js 13のApp RouterとTypeScriptを使用して作成した個人ポートフォリオサイト。shadcn/uiコンポーネントを活用し、Framer Motionでアニメーションを実装。レスポンシブデザインとアクセシビリティにも配慮しました。",
		techStack: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"shadcn/ui",
			"Framer Motion",
		],
		role: "フルスタック開発者",
		achievements: [
			"Lighthouse スコア95以上を達成",
			"ページ読み込み時間を50%削減",
			"アクセシビリティガイドラインに準拠",
		],
		screenshots: [
			"/images/projects/portfolio/home.jpg",
			"/images/projects/portfolio/projects.jpg",
			"/images/projects/portfolio/skills.jpg",
		],
		demoUrl: "https://portfolio.example.com",
		repositoryUrl: "https://github.com/username/portfolio",
	},
	{
		id: "task-manager",
		title: "TaskFlow",
		summary: "直感的に使えるタスク管理アプリケーション",
		thumbnailUrl: "/images/projects/taskflow.jpg",
		type: "web" as const,
		isPublic: true,
		description:
			"React と TypeScript で開発したタスク管理アプリケーション。ドラッグ&ドロップによるタスクの整理、プロジェクト管理、チーム collaboration 機能を実装。バックエンドには Node.js と MongoDB を使用。",
		techStack: [
			"React",
			"TypeScript",
			"Node.js",
			"Express",
			"MongoDB",
			"TailwindCSS",
			"React DnD",
		],
		role: "フロントエンド開発リーダー",
		achievements: [
			"月間アクティブユーザー1000人達成",
			"タスク完了率が平均30%向上",
			"ユーザーフィードバックによる継続的な機能改善",
		],
		screenshots: [
			"/images/projects/taskflow/dashboard.jpg",
			"/images/projects/taskflow/board.jpg",
			"/images/projects/taskflow/analytics.jpg",
		],
		demoUrl: "https://taskflow.example.com",
		repositoryUrl: "https://github.com/username/taskflow",
	},
	{
		id: "ec-site",
		title: "StyleStore",
		summary: "ファッションに特化したECサイト",
		thumbnailUrl: "/images/projects/stylestore.jpg",
		type: "web" as const,
		isPublic: true,
		description:
			"Next.js と Stripe を使用して開発したECサイト。商品管理、在庫管理、決済処理、注文管理などの機能を実装。管理画面では売上分析やユーザー行動分析も可能。",
		techStack: [
			"Next.js",
			"TypeScript",
			"Prisma",
			"PostgreSQL",
			"Stripe",
			"TailwindCSS",
			"React Query",
		],
		role: "フルスタック開発者",
		achievements: [
			"月間売上200万円達成",
			"カート放棄率を40%削減",
			"ページ読み込み時間を2秒以内に最適化",
		],
		screenshots: [
			"/images/projects/stylestore/home.jpg",
			"/images/projects/stylestore/product.jpg",
			"/images/projects/stylestore/cart.jpg",
		],
		demoUrl: "https://stylestore.example.com",
		repositoryUrl: "https://github.com/username/stylestore",
	},
	{
		id: "chat-app",
		title: "ChatHub",
		summary: "リアルタイムチャットアプリケーション",
		thumbnailUrl: "/images/projects/chathub.jpg",
		type: "web" as const,
		isPublic: true,
		description:
			"Socket.IO と React を使用したリアルタイムチャットアプリケーション。グループチャット、ダイレクトメッセージ、ファイル共有、既読機能などを実装。",
		techStack: [
			"React",
			"Node.js",
			"Socket.IO",
			"MongoDB",
			"Express",
			"TailwindCSS",
			"Redux Toolkit",
		],
		role: "バックエンド開発リーダー",
		achievements: [
			"同時接続ユーザー500人を実現",
			"メッセージ配信遅延を100ms以下に抑制",
			"AWS を使用したスケーラブルなインフラ構築",
		],
		screenshots: [
			"/images/projects/chathub/chat.jpg",
			"/images/projects/chathub/groups.jpg",
			"/images/projects/chathub/profile.jpg",
		],
		demoUrl: "https://chathub.example.com",
		repositoryUrl: "https://github.com/username/chathub",
	},
] as const;

export const getFeaturedProjects = () =>
	PROJECTS.slice(0, 3) as unknown as Product[];

export const getProjectById = (id: string) =>
	PROJECTS.find((project) => project.id === id) as unknown as
		| Product
		| undefined;
