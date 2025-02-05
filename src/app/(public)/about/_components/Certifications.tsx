"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";

const certifications = [
	{
		category: "資格",
		icon: Award,
		items: [
			{
				title: "情報処理安全確保支援士（登録セキスペ）",
				date: "2019年4月",
				description: "セキュリティ分野の最高峰資格",
			},
			{
				title: "AWS Solutions Architect Professional",
				date: "2020年6月",
				description: "AWSの上級資格",
			},
			{
				title: "Google Cloud Professional Architect",
				date: "2021年3月",
				description: "GCPの上級資格",
			},
			{
				title: "Oracle Certified Master, Java SE 11",
				date: "2021年9月",
				description: "Javaの最上位資格",
			},
		],
	},
	{
		category: "受賞歴",
		icon: Trophy,
		items: [
			{
				title: "XXXX ハッカソン 優勝",
				date: "2023年10月",
				description: "AIを活用した教育支援システムの開発で受賞",
			},
			{
				title: "YYYY Tech Award 2023",
				date: "2023年7月",
				description: "革新的なWeb技術の活用が評価",
			},
			{
				title: "オープンソースコントリビューター賞",
				date: "2022年12月",
				description: "Next.jsへの貢献が評価",
			},
		],
	},
];

export const Certifications = () => {
	return (
		<section className="py-20 bg-secondary/5">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">資格・受賞歴</h2>
					<p className="text-lg text-muted-foreground">取得資格と受賞実績</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
					{certifications.map((cert, certIndex) => (
						<motion.div
							key={cert.category}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: certIndex * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full">
								<CardContent className="p-6">
									<div className="flex items-center gap-3 mb-6">
										<cert.icon className="h-6 w-6 text-primary" />
										<h3 className="text-xl font-semibold">{cert.category}</h3>
									</div>
									<div className="space-y-6">
										{cert.items.map((item, index) => (
											<motion.div
												key={item.title}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{
													duration: 0.5,
													delay: certIndex * 0.1 + index * 0.1,
												}}
												viewport={{ once: true }}
											>
												<div className="border-l-2 border-primary/20 pl-4">
													<div className="text-sm text-muted-foreground mb-1">
														{item.date}
													</div>
													<h4 className="font-semibold mb-1">{item.title}</h4>
													<p className="text-sm text-muted-foreground">
														{item.description}
													</p>
												</div>
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
