export type Skill = {
	id: string;
	name: string;
	category: string;
	level: number;
	yearsOfExperience: number;
	relatedProjects: string[];
	description?: string;
};

export type Product = {
	id: string;
	title: string;
	summary: string;
	thumbnailUrl: string;
	type: "web" | "mobile" | "library" | "other";
	isPublic: boolean;
	description: string;
	techStack: string[];
	role: string;
	achievements: string[];
	screenshots: string[];
	demoUrl?: string;
	repositoryUrl?: string;
};

export type Profile = {
	name: string;
	photoUrl: string;
	introduction: string;
	contacts: {
		email?: string;
		github?: string;
		linkedin?: string;
	};
	careerHistory: {
		companyName: string;
		period: {
			start: Date;
			end?: Date;
		};
		position: string;
		description: string;
	}[];
	education?: {
		school: string;
		degree: string;
		period: {
			start: Date;
			end: Date;
		};
	}[];
	qualifications?: {
		name: string;
		acquiredDate: Date;
	}[];
};
