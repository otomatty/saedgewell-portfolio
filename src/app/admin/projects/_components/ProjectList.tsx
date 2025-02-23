"use client";

import { getProjects } from "@/_actions/projects/projects";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";
import type { Project } from "@/types/project";

export function ProjectList() {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		async function fetchProjects() {
			const { data } = await getProjects();
			if (data) {
				const convertedProjects: Project[] = data.map((project) => ({
					id: project.id,
					userId: project.user_id,
					name: project.name,
					emoji: project.emoji || undefined,
					description: project.description || undefined,
					isArchived: project.is_archived || false,
					createdAt: new Date(project.created_at || new Date()),
					updatedAt: new Date(project.updated_at || new Date()),
				}));
				setProjects(convertedProjects);
			}
		}
		fetchProjects();
	}, []);

	if (projects.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					プロジェクトがありません。新しいプロジェクトを作成してください。
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{projects.map((project) => (
				<ProjectCard
					key={project.id}
					id={project.id}
					name={project.name}
					description={project.description}
					emoji={project.emoji}
				/>
			))}
		</div>
	);
}
