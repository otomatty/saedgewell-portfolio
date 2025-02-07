"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ContactDialog } from "@/components/custom/contact/contact-dialog";

export const Hero = () => {
	return (
		<section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center"
				>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text  bg-gradient-to-r from-primary to-primary/80">
						エンジニアリングで
						<br />
						ビジネスの成功を実現する
					</h1>
					<p className="text-xl md:text-2xl  mb-8">
						プロダクトエンジニアとして、あなたのビジョンを現実に
					</p>
					<div className="flex gap-4 justify-center">
						<Button size="lg" className="group">
							<Link href="/works">実績を見る</Link>
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
						<ContactDialog triggerSize="lg" />
					</div>
				</motion.div>
			</div>

			{/* 背景のアニメーション要素 */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
			</div>
		</section>
	);
};
