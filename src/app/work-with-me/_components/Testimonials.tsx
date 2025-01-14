"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TESTIMONIALS = [
	{
		name: "田中 太郎",
		role: "株式会社ABC 代表取締役",
		comment:
			"Webサイトのリニューアルプロジェクトを依頼しましたが、期待以上の成果を出していただきました。特にパフォーマンスの改善とユーザビリティの向上は素晴らしかったです。",
		avatarUrl: "/images/testimonials/tanaka.jpg",
		rating: 5,
	},
	{
		name: "鈴木 花子",
		role: "DEFスタートアップ CTO",
		comment:
			"技術的な知見が深く、プロジェクトの課題に対して的確なソリューションを提案していただけました。コミュニケーションも円滑で、安心してお任せできました。",
		avatarUrl: "/images/testimonials/suzuki.jpg",
		rating: 5,
	},
	{
		name: "山田 健一",
		role: "フリーランスデザイナー",
		comment:
			"デザインの意図を十分に理解し、細部まで丁寧に実装していただきました。アニメーションの実装も素晴らしく、満足度の高い仕上がりでした。",
		avatarUrl: "/images/testimonials/yamada.jpg",
		rating: 5,
	},
];

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-20">
			<div className="container">
				<h2 className="text-3xl font-bold text-center mb-12">お客様の声</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{TESTIMONIALS.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center gap-4 mb-4">
										<Avatar>
											<AvatarImage
												src={testimonial.avatarUrl}
												alt={testimonial.name}
											/>
											<AvatarFallback>
												{testimonial.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-semibold">{testimonial.name}</p>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</div>
									<div className="flex gap-0.5 mb-4">
										{Array.from({ length: testimonial.rating }).map((_, i) => (
											<Star
												key={`${testimonial.name}-star-${i}`}
												className="h-4 w-4 fill-primary text-primary"
											/>
										))}
									</div>
									<p className="text-muted-foreground">{testimonial.comment}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
