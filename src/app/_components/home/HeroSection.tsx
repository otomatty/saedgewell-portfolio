"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
	return (
		<section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
				>
					Welcome to My Portfolio
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-xl sm:text-2xl mb-8 text-gray-300"
				>
					フロントエンド開発者として、革新的なWebエクスペリエンスを創造します
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="flex gap-4 justify-center"
				>
					<Button
						asChild
						variant="default"
						size="lg"
						className="bg-white text-gray-900 hover:bg-gray-200"
					>
						<Link href="/products">プロジェクトを見る</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="border-white text-white hover:bg-white hover:text-gray-900"
					>
						<Link href="/contact">お問い合わせ</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
