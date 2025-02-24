export interface ProjectInput {
	name: string;
	description?: string;
	emoji?: string;
}

export interface MilestoneInput {
	projectId: string;
	title: string;
	description?: string;
	dueDate?: Date;
	status: "not_started" | "in_progress" | "completed";
	progress?: number;
}

export interface TaskInput {
	projectId: string;
	milestoneId?: string;
	title: string;
	description?: string;
	status: "todo" | "in_progress" | "done";
	priority?: number;
	dueDate?: Date;
}

export interface ProgressLogInput {
	projectId: string;
	milestoneId?: string;
	taskId?: string;
	logType: "milestone" | "task" | "general";
	description: string;
	hoursSpent?: number;
}
