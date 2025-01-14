"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DynamicIcon, type iconComponents } from "./icons";
import { ArrowRight } from "lucide-react";

type Service = {
	iconName: string;
	title: string;
	description: string;
	details: string[];
};

type Props = {
	services: Service[];
};

export default function ServicesList({ services }: Props) {
	return (
		<section id="services" className="py-20">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl font-bold mb-4">提供サービス</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						フロントエンド開発を中心に、プロジェクトの成功に必要なサービスを提供します。
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service, index) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="relative h-full overflow-hidden group">
								{/* 背景のグラデーション */}
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

								<CardHeader className="relative">
									<div className="mb-6 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
										<DynamicIcon
											name={service.iconName as keyof typeof iconComponents}
											className="h-6 w-6 text-primary"
										/>
										<CardTitle className="text-lg ml-2">
											{service.title}
										</CardTitle>
									</div>

									<p className="text-muted-foreground">{service.description}</p>
								</CardHeader>

								<CardContent className="relative space-y-4">
									<ul className="space-y-2">
										{service.details.map((detail) => (
											<li key={detail} className="flex items-start gap-2">
												<ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
												<span className="text-sm">{detail}</span>
											</li>
										))}
									</ul>

									<div className="pt-4 mt-4 border-t">
										<Button
											variant="ghost"
											className="group/button p-0 h-auto hover:bg-transparent"
										>
											<span className="text-primary">詳しく見る</span>
											<ArrowRight className="ml-2 h-4 w-4 text-primary transition-transform group-hover/button:translate-x-1" />
										</Button>
									</div>
								</CardContent>

								{/* 装飾的な要素 */}
								<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
