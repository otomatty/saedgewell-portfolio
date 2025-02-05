"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

export const Introduction = () => {
	return (
		<section className="py-20 bg-secondary/5">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 gap-12 items-center"
				>
					<div className="relative aspect-square rounded-full overflow-hidden border-4 border-primary/20">
						<Image
							src="/images/profile.jpg"
							alt="Profile"
							fill
							className="object-cover"
							priority
						/>
					</div>

					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-bold">
							技術で価値を創造する
							<br />
							プロダクトエンジニア
						</h2>
						<p className="text-lg text-muted-foreground">
							フロントエンドからバックエンド、インフラまで幅広い技術スタックを活用し、
							ビジネスの成長に貢献するソリューションを提供しています。
						</p>

						<div className="grid grid-cols-2 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="text-4xl font-bold text-primary">
										<NumberTicker value={5} />
										<span className="text-sm text-muted-foreground">年</span>
									</div>
									<div className="text-sm text-muted-foreground">開発経験</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="text-4xl font-bold text-primary">
										<NumberTicker value={50} />
										<span className="text-sm text-muted-foreground">件</span>
									</div>
									<div className="text-sm text-muted-foreground">
										プロジェクト実績
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
