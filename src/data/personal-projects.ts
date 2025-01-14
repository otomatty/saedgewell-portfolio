import type { Product } from "@/types";

export const PERSONAL_PROJECTS: Product[] = [
	{
		id: "my-blog",
		title: "Tech Blog",
		summary: "技術ブログプラットフォーム",
		thumbnailUrl: "/images/projects/blog.jpg",
		type: "web",
		isPublic: true,
		description:
			"Next.js と MDX を使用して開発した技術ブログプラットフォーム。Markdownでの記事作成、シンタックスハイライト、目次生成、検索機能などを実装。また、OGP画像の自動生成機能も備えています。",
		techStack: [
			"Next.js",
			"TypeScript",
			"MDX",
			"Tailwind CSS",
			"Prisma",
			"PostgreSQL",
		],
		role: "個人開発",
		achievements: [
			"月間PV 10,000達成",
			"検索エンジンからの流入が前月比50%増加",
			"記事の読了率が平均70%",
		],
		screenshots: [
			"/images/projects/blog/home.jpg",
			"/images/projects/blog/article.jpg",
			"/images/projects/blog/search.jpg",
		],
		demoUrl: "https://blog.example.com",
		repositoryUrl: "https://github.com/username/tech-blog",
	},
	{
		id: "code-snippets",
		title: "Code Snippets",
		summary: "コードスニペット管理ツール",
		thumbnailUrl: "/images/projects/snippets.jpg",
		type: "web",
		isPublic: true,
		description:
			"頻繁に使用するコードスニペットを管理・共有できるWebアプリケーション。タグ付け、検索、シンタックスハイライト、クリップボードへのコピー機能を実装。GitHub連携による同期機能も備えています。",
		techStack: [
			"React",
			"TypeScript",
			"Node.js",
			"MongoDB",
			"Express",
			"Tailwind CSS",
		],
		role: "個人開発",
		achievements: [
			"登録ユーザー数500人達成",
			"スニペット共有数5,000件突破",
			"GitHub Starが100を超える",
		],
		screenshots: [
			"/images/projects/snippets/dashboard.jpg",
			"/images/projects/snippets/editor.jpg",
			"/images/projects/snippets/search.jpg",
		],
		demoUrl: "https://snippets.example.com",
		repositoryUrl: "https://github.com/username/code-snippets",
	},
];
