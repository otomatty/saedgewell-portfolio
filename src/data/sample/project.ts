import type { Project, ProjectMetrics } from "@/types/project";

export const sampleProject: Project = {
	id: "1",
	name: "ポートフォリオサイトリニューアル",
	description:
		"既存のポートフォリオサイトをNext.js 14とsupabaseを使用してリニューアル",
	startDate: "2024-01-01",
	endDate: "2024-03-31",
	status: "in_progress",
	progress: 65,
	budget: {
		total: 1000000,
		used: 650000,
		remaining: 350000,
	},
	workHours: {
		planned: 480,
		actual: 320,
		remaining: 160,
	},
	metrics: {
		taskCompletion: 68,
		resourceUtilization: 85,
		scheduleVariance: 95,
		quality: {
			bugRate: 2.5,
			testCoverage: 85,
			codeReviewRate: 98,
		},
	},
};

export const sampleMetrics: ProjectMetrics = {
	daily: Array.from({ length: 14 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (13 - i));
		return {
			date: date.toISOString().split("T")[0],
			workHours: Math.floor(Math.random() * 5) + 4,
			taskCompletion: Math.min(100, Math.floor((i + 1) * 7.5)),
		};
	}),
	weekly: Array.from({ length: 8 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - 7 * (7 - i));
		return {
			week: `Week ${i + 1}`,
			workHours: Math.floor(Math.random() * 25) + 20,
			taskCompletion: Math.min(100, Math.floor((i + 1) * 12.5)),
		};
	}),
};
