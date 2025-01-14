"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Calculator } from "lucide-react";
import Link from "next/link";

const PRICING_PLANS = [
	{
		name: "スポット開発",
		price: "50,000円〜",
		period: "プロジェクトベース",
		description: "小規模な開発や単発の改修に最適なプラン",
		features: [
			"要件定義・設計",
			"実装・テスト",
			"本番環境へのデプロイ",
			"1ヶ月の保守サポート",
		],
		note: "※ 具体的な金額は要件に応じて見積もりいたします",
		accent: "from-blue-500/10 to-cyan-500/10 shadow-blue-500/10",
		accentDark: "dark:from-blue-500/20 dark:to-cyan-500/20",
	},
	{
		name: "技術支援",
		price: "100,000円〜",
		period: "月額",
		description: "継続的な開発支援や技術コンサルティングに",
		features: [
			"週3日までの稼働",
			"定期的なコードレビュー",
			"技術的な相談・アドバイス",
			"オンラインMTGによる進捗確認",
			"緊急時の対応",
		],
		note: "※ 稼働日数により金額は変動します",
		isPopular: true,
		accent: "from-violet-500/10 to-purple-500/10 shadow-purple-500/10",
		accentDark: "dark:from-violet-500/20 dark:to-purple-500/20",
	},
	{
		name: "フルサポート",
		price: "300,000円〜",
		period: "月額",
		description: "プロジェクトの立ち上げから運用までをサポート",
		features: [
			"週5日のフルタイム稼働",
			"要件定義から運用まで一貫対応",
			"チーム開発のサポート",
			"技術戦略の策定",
			"定期的な報告・提案",
		],
		note: "※ 長期契約の場合は割引あり",
		accent: "from-pink-500/10 to-rose-500/10 shadow-rose-500/10",
		accentDark: "dark:from-pink-500/20 dark:to-rose-500/20",
	},
];

export default function PricingPlans() {
	return (
		<section id="pricing" className="py-20">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl font-bold mb-4">料金プラン</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						プロジェクトの規模や要件に応じて、最適なプランをご提案いたします
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{PRICING_PLANS.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card
								className={`relative h-full group overflow-hidden ${plan.isPopular ? "border-2 border-primary" : ""}`}
							>
								{/* グラデーション背景 */}
								<div
									className={`absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-300 group-hover:opacity-100 ${plan.accent} ${plan.accentDark}`}
								/>

								{plan.isPopular && (
									<div className="absolute -top-px left-0 right-0">
										<div className="flex items-center justify-center gap-1 py-2 bg-primary text-primary-foreground">
											<Sparkles className="h-4 w-4" />
											<span className="text-sm font-medium">人気プラン</span>
										</div>
									</div>
								)}

								<CardHeader
									className={`relative ${plan.isPopular ? "pt-12" : ""}`}
								>
									<CardTitle>
										<h3 className="text-2xl font-bold">{plan.name}</h3>
									</CardTitle>
									<div className="mt-4">
										<p className="text-3xl font-bold">{plan.price}</p>
										<p className="text-sm text-muted-foreground">
											{plan.period}
										</p>
									</div>
									<p className="mt-4 text-muted-foreground">
										{plan.description}
									</p>
								</CardHeader>

								<CardContent className="relative space-y-6">
									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li key={feature} className="flex items-start gap-2">
												<Check className="h-4 w-4 text-primary mt-1 shrink-0" />
												<span className="text-sm">{feature}</span>
											</li>
										))}
									</ul>
									<p className="text-xs text-muted-foreground">{plan.note}</p>
									<Button
										className="w-full"
										variant={plan.isPopular ? "default" : "outline"}
									>
										このプランを選択
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* 自動見積もりCTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-16 text-center"
				>
					<Button asChild size="lg" variant="outline" className="group">
						<Link href="/work-with-me/estimate">
							<Calculator className="mr-2 h-4 w-4" />
							カスタマイズした見積もりを作成
						</Link>
					</Button>
					<p className="mt-4 text-sm text-muted-foreground">
						より詳細な要件に基づいて、カスタマイズされた見積もりを自動で作成できます
					</p>
				</motion.div>
			</div>
		</section>
	);
}
