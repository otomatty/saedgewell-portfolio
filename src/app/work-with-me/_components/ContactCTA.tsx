"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactCTA() {
	return (
		<section id="contact" className="py-20">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-2xl mx-auto text-center"
				>
					<h2 className="text-3xl font-bold mb-4">
						プロジェクトについて相談してみませんか？
					</h2>
					<p className="text-muted-foreground mb-8">
						お気軽にお問い合わせください。プロジェクトの目的や課題について詳しくお伺いし、最適な解決策を提案させていただきます。
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg">
							<Link href="/profile#contact">お問い合わせ</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/personal-projects">実績を見る</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
