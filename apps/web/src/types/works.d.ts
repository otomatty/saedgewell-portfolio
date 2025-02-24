// 実績データの型定義
interface WorkData {
	title: string;
	description: string;
	thumbnail: string;
	technologies: string[];
	category: "company" | "freelance" | "personal";
	slug: string;
	links?: {
		github?: string;
		website?: string;
	};
	overview: string;
	role: string;
	period: string;
	teamSize: string;
	responsibilities: string[];
	challenges: {
		title: string;
		description: string;
	}[];
	solutions: {
		title: string;
		description: string;
	}[];
	results: string[];
	images: {
		url: string;
		alt: string;
		caption?: string;
	}[];
}
