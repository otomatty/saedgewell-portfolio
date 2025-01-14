"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getFeaturedProjects } from "@/data/projects";

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

const LatestProjects = () => {
	const featuredProjects = getFeaturedProjects();

	return (
		<section className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-3xl font-bold text-center mb-12"
				>
					最新のプロジェクト
				</motion.h2>
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{featuredProjects.map((project) => (
						<motion.div key={project.id} variants={item}>
							<Card>
								<div className="relative h-48">
									<Image
										src={project.thumbnailUrl}
										alt={project.title}
										fill
										className="object-cover rounded-t-lg"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
								</div>
								<CardHeader>
									<CardTitle>{project.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{project.summary}</p>
								</CardContent>
								<CardFooter className="flex justify-between items-center">
									<Button asChild variant="link">
										<Link href={`/products/${project.id}`}>詳細を見る →</Link>
									</Button>
									<Badge variant="secondary">{project.type}</Badge>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
					className="text-center mt-12"
				>
					<Button asChild size="lg">
						<Link href="/products">すべてのプロジェクトを見る</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
};

export default LatestProjects;
