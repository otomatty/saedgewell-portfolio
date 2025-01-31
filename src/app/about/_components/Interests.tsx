"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Code2, Gamepad2, Plane } from "lucide-react";

const interests = [
	{
		icon: Code2,
		title: "オープンソース活動",
		description:
			"休日はOSSのコントリビューションや個人プロジェクトの開発を楽しんでいます。",
	},
	{
		icon: Book,
		title: "技術書執筆",
		description:
			"技術ブログの執筆や、技術書の寄稿を通じて知識の共有を行っています。",
	},
	{
		icon: Gamepad2,
		title: "ゲーム開発",
		description: "趣味でUnityを使用したゲーム開発に取り組んでいます。",
	},
	{
		icon: Plane,
		title: "旅行",
		description:
			"新しい文化や場所との出会いを通じて、視野を広げることを大切にしています。",
	},
];

export const Interests = () => {
	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">趣味・関心事</h2>
					<p className="text-lg text-muted-foreground">
						プライベートでの活動や興味のある分野
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{interests.map((interest, index) => (
						<motion.div
							key={interest.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full">
								<CardContent className="p-6">
									<div className="flex gap-4">
										<div className="flex-shrink-0">
											<interest.icon className="h-8 w-8 text-primary" />
										</div>
										<div>
											<h3 className="text-lg font-semibold mb-2">
												{interest.title}
											</h3>
											<p className="text-muted-foreground">
												{interest.description}
											</p>
										</div>
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
