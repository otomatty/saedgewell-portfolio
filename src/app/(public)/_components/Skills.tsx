"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skillCategories = [
	{
		title: "フロントエンド",
		skills: [
			{ name: "Next.js / React", level: 95 },
			{ name: "TypeScript", level: 90 },
			{ name: "Tailwind CSS", level: 85 },
			{ name: "UI/UXデザイン", level: 80 },
		],
	},
	{
		title: "バックエンド",
		skills: [
			{ name: "Node.js", level: 85 },
			{ name: "Python", level: 80 },
			{ name: "PostgreSQL", level: 75 },
			{ name: "GraphQL", level: 70 },
		],
	},
	{
		title: "インフラ/DevOps",
		skills: [
			{ name: "Docker", level: 85 },
			{ name: "AWS", level: 80 },
			{ name: "CI/CD", level: 75 },
			{ name: "Kubernetes", level: 65 },
		],
	},
];

export const Skills = () => {
	return (
		<section className="py-20 bg-secondary/5">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">技術スタック</h2>
					<p className="text-lg text-muted-foreground">
						モダンな技術スタックを活用し、最適なソリューションを提供します
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{skillCategories.map((category, categoryIndex) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
							viewport={{ once: true }}
						>
							<Card className="h-full">
								<CardContent className="p-6">
									<h3 className="text-xl font-semibold mb-6">
										{category.title}
									</h3>
									<div className="space-y-6">
										{category.skills.map((skill, skillIndex) => (
											<motion.div
												key={skill.name}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{
													duration: 0.5,
													delay: categoryIndex * 0.2 + skillIndex * 0.1,
												}}
												viewport={{ once: true }}
											>
												<div className="flex justify-between items-center mb-2">
													<span className="font-medium">{skill.name}</span>
													<span className="text-sm text-muted-foreground">
														{skill.level}%
													</span>
												</div>
												<Progress value={skill.level} className="h-2" />
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
