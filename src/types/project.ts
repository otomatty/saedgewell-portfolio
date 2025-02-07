/**
 * プロジェクトの型定義
 */
export interface Project {
	id: string;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	status: "not_started" | "in_progress" | "on_hold" | "completed";
	progress: number;
	budget: {
		total: number;
		used: number;
		remaining: number;
	};
	workHours: {
		planned: number;
		actual: number;
		remaining: number;
	};
	metrics: {
		taskCompletion: number;
		resourceUtilization: number;
		scheduleVariance: number;
		quality: {
			bugRate: number;
			testCoverage: number;
			codeReviewRate: number;
		};
	};
}

/**
 * プロジェクトメトリクスの型定義
 */
export interface ProjectMetrics {
	daily: {
		date: string;
		workHours: number;
		taskCompletion: number;
	}[];
	weekly: {
		week: string;
		workHours: number;
		taskCompletion: number;
	}[];
}
