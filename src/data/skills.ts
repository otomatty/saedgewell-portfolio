import type { Skill } from "@/types";

export const SKILLS: Skill[] = [
	{
		id: "nextjs",
		name: "Next.js",
		category: "フロントエンド",
		level: 4,
		yearsOfExperience: 3,
		relatedProjects: ["portfolio-site", "ec-site"],
		description:
			"App RouterやServer Componentsなど最新機能を活用したWebアプリケーション開発の経験があります。パフォーマンスとSEOを考慮したアプリケーション設計が得意です。",
	},
	{
		id: "react",
		name: "React",
		category: "フロントエンド",
		level: 5,
		yearsOfExperience: 4,
		relatedProjects: ["task-manager", "chat-app"],
		description:
			"Hooksを活用した効率的なステート管理、カスタムフックの作成、パフォーマンス最適化など、Reactの深い知識を持っています。",
	},
	{
		id: "typescript",
		name: "TypeScript",
		category: "フロントエンド",
		level: 4,
		yearsOfExperience: 3,
		relatedProjects: ["portfolio-site", "task-manager", "ec-site"],
		description:
			"型安全なアプリケーション開発を心がけ、カスタム型の定義やジェネリクスの活用など、TypeScriptの高度な機能を使いこなせます。",
	},
	{
		id: "nodejs",
		name: "Node.js",
		category: "バックエンド",
		level: 4,
		yearsOfExperience: 3,
		relatedProjects: ["task-manager", "chat-app"],
		description:
			"Express.jsを使用したRESTful API開発、WebSocketを使用したリアルタイム通信の実装経験があります。",
	},
	{
		id: "postgresql",
		name: "PostgreSQL",
		category: "バックエンド",
		level: 3,
		yearsOfExperience: 2,
		relatedProjects: ["ec-site"],
		description:
			"リレーショナルデータベースの設計、パフォーマンスチューニング、バックアップ/リストアの経験があります。",
	},
	{
		id: "mongodb",
		name: "MongoDB",
		category: "バックエンド",
		level: 4,
		yearsOfExperience: 2,
		relatedProjects: ["task-manager", "chat-app"],
		description:
			"NoSQLデータベースの設計、インデックス設計、アグリゲーションパイプラインの活用経験があります。",
	},
	{
		id: "docker",
		name: "Docker",
		category: "インフラ",
		level: 3,
		yearsOfExperience: 2,
		relatedProjects: ["ec-site", "chat-app"],
		description:
			"Dockerを使用した開発環境の構築、本番環境のコンテナ化、CI/CDパイプラインの構築経験があります。",
	},
	{
		id: "aws",
		name: "AWS",
		category: "インフラ",
		level: 3,
		yearsOfExperience: 2,
		relatedProjects: ["ec-site", "chat-app"],
		description:
			"EC2, S3, RDS, CloudFront, Route53などの主要サービスを使用したインフラ構築の経験があります。",
	},
];

export const getSkillsByCategory = () => {
	const categories = [...new Set(SKILLS.map((skill) => skill.category))];
	return categories.map((category) => ({
		name: category,
		skills: SKILLS.filter((skill) => skill.category === category),
	}));
};

export const getSkillById = (id: string) =>
	SKILLS.find((skill) => skill.id === id);
