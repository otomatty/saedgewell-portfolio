"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
			{/* 装飾的な背景要素 */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 -right-1/2 w-[100rem] h-[100rem] bg-primary/5 rounded-full" />
				<div className="absolute -bottom-1/2 -left-1/2 w-[100rem] h-[100rem] bg-primary/5 rounded-full" />
			</div>

			<div className="container relative">
				<div className="max-w-3xl mx-auto text-center space-y-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="space-y-4"
					>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
							あなたのプロジェクトを
							<span className="text-primary">成功</span>
							に導きます
						</h1>
						<p className="text-xl text-muted-foreground">
							フロントエンド開発の経験を活かし、ユーザー体験の向上とビジネスの成長をサポートします。
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex flex-col sm:flex-row gap-4 justify-center"
					>
						<Button asChild size="lg" className="group">
							<Link href="#services">
								サービスを見る
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="#contact">お問い合わせ</Link>
						</Button>
					</motion.div>

					{/* 実績指標 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
					>
						{[
							{ label: "案件実績", value: "50+" },
							{ label: "リピート率", value: "80%" },
							{ label: "開発経験", value: "5年+" },
							{ label: "顧客満足度", value: "4.8/5.0" },
						].map((stat) => (
							<div key={stat.label}>
								<p className="text-3xl font-bold text-primary">{stat.value}</p>
								<p className="text-sm text-muted-foreground">{stat.label}</p>
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
