"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Github } from "lucide-react";
import { motion, type MotionProps } from "framer-motion";
import type { Product } from "@/types";

type Props = {
	project: Product;
	variants?: MotionProps["variants"];
};

export default function ProjectCard({ project, variants }: Props) {
	return (
		<motion.div variants={variants}>
			<Card className="h-full flex flex-col">
				<div className="relative h-64">
					<Image
						src={project.thumbnailUrl}
						alt={project.title}
						fill
						className="object-cover rounded-t-lg"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				</div>
				<CardHeader>
					<div className="flex justify-between items-start gap-4">
						<div>
							<CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
							<p className="text-muted-foreground">{project.summary}</p>
						</div>
						<Badge variant="secondary">{project.type}</Badge>
					</div>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="space-y-6">
						<div>
							<h3 className="font-semibold mb-2">使用技術</h3>
							<div className="flex flex-wrap gap-2">
								{project.techStack.map((tech) => (
									<Badge key={tech} variant="outline">
										{tech}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">主な成果</h3>
							<ul className="list-disc list-inside text-sm text-muted-foreground">
								{project.achievements.map((achievement) => (
									<li key={achievement}>{achievement}</li>
								))}
							</ul>
						</div>
						<div className="flex gap-4">
							{project.demoUrl && (
								<Button asChild>
									<a
										href={project.demoUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										デモを見る
									</a>
								</Button>
							)}
							{project.repositoryUrl && (
								<Button asChild variant="outline">
									<a
										href={project.repositoryUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Github className="mr-2 h-4 w-4" />
										GitHub
									</a>
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
