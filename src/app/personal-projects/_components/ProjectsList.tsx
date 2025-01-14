"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import type { Product } from "@/types";

type Props = {
	projects: Product[];
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

export default function ProjectsList({ projects }: Props) {
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="grid grid-cols-1 md:grid-cols-2 gap-8"
		>
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} variants={item} />
			))}
		</motion.div>
	);
}
