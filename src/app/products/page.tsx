import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";

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

export default function ProductsPage() {
	return (
		<div className="min-h-screen py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-4xl font-bold text-center mb-12"
				>
					プロジェクト一覧
				</motion.h1>
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{PROJECTS.map((project) => (
						<motion.div key={project.id} variants={item}>
							<Card className="h-full flex flex-col">
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
									<div className="flex justify-between items-start">
										<CardTitle className="text-xl">{project.title}</CardTitle>
										<Badge variant="secondary">{project.type}</Badge>
									</div>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-muted-foreground mb-4">
										{project.summary}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{project.techStack.map((tech) => (
											<Badge key={tech} variant="outline">
												{tech}
											</Badge>
										))}
									</div>
									<div className="flex justify-between items-center mt-auto">
										<Button asChild variant="link">
											<Link href={`/products/${project.id}`}>詳細を見る →</Link>
										</Button>
										{project.demoUrl && (
											<Button asChild variant="outline" size="sm">
												<a
													href={project.demoUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													デモを見る
												</a>
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
