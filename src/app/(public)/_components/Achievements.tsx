"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Code2, Trophy } from "lucide-react";

const achievements = [
	{
		icon: Building2,
		title: "企業案件",
		description:
			"大手企業のWebアプリケーション開発、システム改修など、多数の実績があります。",
		stat: "20+",
		label: "プロジェクト",
	},
	{
		icon: Users,
		title: "フリーランス案件",
		description:
			"スタートアップから中小企業まで、様々な規模の開発案件を担当してきました。",
		stat: "15+",
		label: "クライアント",
	},
	{
		icon: Code2,
		title: "個人開発",
		description:
			"自社サービスの開発や、オープンソースプロジェクトへの貢献を行っています。",
		stat: "10+",
		label: "プロダクト",
	},
	{
		icon: Trophy,
		title: "受賞歴",
		description:
			"ハッカソンでの入賞や、技術カンファレンスでの登壇実績があります。",
		stat: "5+",
		label: "受賞",
	},
];

export const Achievements = () => {
	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">実績</h2>
					<p className="text-lg text-muted-foreground">
						これまでの開発実績とその成果をご紹介します
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{achievements.map((achievement, index) => (
						<motion.div
							key={achievement.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full">
								<CardHeader>
									<achievement.icon className="h-8 w-8 text-primary mb-2" />
									<CardTitle>{achievement.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">
										{achievement.description}
									</p>
									<div className="flex items-baseline gap-2">
										<span className="text-3xl font-bold text-primary">
											{achievement.stat}
										</span>
										<span className="text-sm text-muted-foreground">
											{achievement.label}
										</span>
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
