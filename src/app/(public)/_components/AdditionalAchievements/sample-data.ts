import type { Work } from "@/types/work";

export const sampleWorks: Work[] = [
	{
		id: "1",
		title: "ECサイトリニューアル",
		slug: "ec-site-renewal",
		description:
			"大手アパレルブランドのECサイトをNext.jsでフルリニューアル。パフォーマンスと売上の大幅改善を実現。",
		thumbnail_url: "/images/works/sample-1.jpg",
		github_url: null,
		website_url: "https://example.com",
		category: "company",
		status: "published",
		created_at: "2024-01-01",
		updated_at: "2024-01-01",
		work_technologies: [
			{
				technologies: {
					id: "1",
					name: "Next.js",
					category: "frontend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "2",
					name: "TypeScript",
					category: "language",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "3",
					name: "Tailwind CSS",
					category: "frontend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
		],
		work_details: [],
		work_images: [],
		work_responsibilities: [],
		work_challenges: [],
		work_solutions: [],
		work_results: [],
	},
	{
		id: "2",
		title: "AIチャットボット開発",
		slug: "ai-chatbot",
		description:
			"OpenAI APIを活用したカスタマーサポート向けチャットボットの開発。応対時間の50%削減を達成。",
		thumbnail_url: "/images/works/sample-2.jpg",
		github_url: "https://github.com/example/chatbot",
		website_url: null,
		category: "freelance",
		status: "published",
		created_at: "2024-02-01",
		updated_at: "2024-02-01",
		work_technologies: [
			{
				technologies: {
					id: "4",
					name: "OpenAI API",
					category: "ai",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "5",
					name: "Python",
					category: "language",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "6",
					name: "FastAPI",
					category: "backend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
		],
		work_details: [],
		work_images: [],
		work_responsibilities: [],
		work_challenges: [],
		work_solutions: [],
		work_results: [],
	},
	{
		id: "3",
		title: "ポートフォリオサイト",
		slug: "portfolio",
		description:
			"Next.js 15とTailwind CSSを使用した完全レスポンシブなポートフォリオサイト。",
		thumbnail_url: "/images/works/sample-3.jpg",
		github_url: "https://github.com/example/portfolio",
		website_url: "https://example.com",
		category: "personal",
		status: "published",
		created_at: "2024-03-01",
		updated_at: "2024-03-01",
		work_technologies: [
			{
				technologies: {
					id: "1",
					name: "Next.js",
					category: "frontend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "3",
					name: "Tailwind CSS",
					category: "frontend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "7",
					name: "Framer Motion",
					category: "frontend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
			{
				technologies: {
					id: "8",
					name: "Supabase",
					category: "backend",
					created_at: "2024-01-01",
					updated_at: "2024-01-01",
				},
			},
		],
		work_details: [],
		work_images: [],
		work_responsibilities: [],
		work_challenges: [],
		work_solutions: [],
		work_results: [],
	},
];
