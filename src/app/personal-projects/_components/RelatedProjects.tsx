"use client";

import { motion } from "framer-motion";
import { PERSONAL_PROJECTS } from "@/data/personal-projects";
import ProjectCard from "./ProjectCard";
import type { Product } from "@/types";

type Props = {
	currentProject: Product;
};

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function RelatedProjects({ currentProject }: Props) {
	const relatedProjects = PERSONAL_PROJECTS.filter(
		(project) =>
			project.id !== currentProject.id &&
			project.techStack.some((tech) => currentProject.techStack.includes(tech)),
	).slice(0, 2);

	if (relatedProjects.length === 0) return null;

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-6">関連プロジェクト</h2>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 md:grid-cols-2 gap-8"
			>
				{relatedProjects.map((project) => (
					<ProjectCard key={project.id} project={project} variants={item} />
				))}
			</motion.div>
		</div>
	);
}
