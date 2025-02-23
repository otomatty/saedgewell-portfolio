export interface GitHubContribution {
	id: string;
	userId: string;
	contributionDate: Date;
	contributionCount: number;
	linesAdded: number;
	linesDeleted: number;
	commitCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GitHubSettings {
	id: string;
	userId: string;
	username: string;
	repository: string;
	accessToken: string;
	autoSync: boolean;
	lastSyncedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CommitStats {
	additions: number;
	deletions: number;
	total: number;
}
