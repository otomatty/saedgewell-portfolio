"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Github } from "lucide-react";
import type { Product } from "@/types";

type Props = {
	project: Product;
};

export default function ProjectDetail({ project }: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-12"
		>
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">{project.title}</h1>
				<p className="text-xl text-muted-foreground">{project.summary}</p>
			</div>

			<div className="relative h-[400px] rounded-lg overflow-hidden">
				<Image
					src={project.thumbnailUrl}
					alt={project.title}
					fill
					className="object-cover"
					priority
				/>
			</div>

			<div className="space-y-6">
				{/* ... 既存のプロジェクト詳細コンテンツ ... */}
			</div>
		</motion.div>
	);
}
