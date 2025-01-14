"use client";

import { motion } from "framer-motion";

export default function ProjectsHeader() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center mb-12"
		>
			<h1 className="text-4xl font-bold mb-4">個人開発プロダクト</h1>
			<p className="text-muted-foreground">
				個人で開発・運営しているプロダクトを紹介します
			</p>
		</motion.div>
	);
}
