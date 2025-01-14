"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getSkillsByCategory } from "@/data/skills";
import { getLevelText } from "@/lib/utils/skill";

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

const SkillsHighlight = () => {
	const skillsByCategory = getSkillsByCategory();
	const highlightedCategories = skillsByCategory.slice(0, 3);

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-3xl font-bold text-center mb-12"
				>
					主要スキル
				</motion.h2>
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{highlightedCategories.map((category) => (
						<motion.div key={category.name} variants={item}>
							<Card>
								<CardHeader>
									<CardTitle>{category.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										{category.skills.slice(0, 3).map((skill) => (
											<li
												key={skill.id}
												className="flex justify-between items-center"
											>
												<span>{skill.name}</span>
												<Badge>{getLevelText(skill.level)}</Badge>
											</li>
										))}
									</ul>
								</CardContent>
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
						<Link href="/skills">すべてのスキルを見る</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
};

export default SkillsHighlight;
