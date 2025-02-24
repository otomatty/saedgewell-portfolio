// types/project.ts
export interface Project {
	id: string;
	userId: string;
	name: string;
	emoji?: string;
	description?: string;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
	lastActivityAt: Date;
}

export type CreateProjectInput = Pick<
	Project,
	"name" | "emoji" | "description"
>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
