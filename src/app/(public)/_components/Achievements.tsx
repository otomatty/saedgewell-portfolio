"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { FeaturedWork } from "@/types/work";

interface AchievementsProps {
	works: FeaturedWork[];
}

/**
 * 実績を表示するコンポーネント
 * スクロールに応じてバーが上に移動し、背景画像とプロジェクト名が切り替わる
 */
export const Achievements = ({ works }: AchievementsProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	// アクティブなインデックスを計算
	const activeIndex = useTransform(scrollYProgress, (value) => {
		return Math.floor(value * 5);
	});

	return (
		<section ref={containerRef} className="relative h-[500vh]">
			{/* 固定コンテナ */}
			<div className="sticky top-0 h-screen overflow-hidden">
				{/* 背景画像コンテナ */}
				<div className="absolute inset-0 w-full h-full">
					{works.map((work, index) => (
						<motion.div
							key={work.id}
							className="absolute inset-0 w-full h-full"
							style={{
								opacity: useTransform(activeIndex, (active) =>
									active === index ? 1 : 0,
								),
								backgroundImage: `url(${work.thumbnail_url})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						>
							{/* 暗いフィルター（透明度を40%に変更） */}
							<div className="absolute inset-0 bg-black/40" />
						</motion.div>
					))}
				</div>

				{/* バーコンテナ */}
				<div className="relative h-full flex items-center justify-center">
					<div className="flex gap-12 px-4">
						{works.map((work, index) => (
							<motion.div
								key={work.id}
								className="relative w-8 h-[60vh]"
								style={{
									y: useTransform(activeIndex, (active) =>
										active === index ? -50 : 0,
									),
								}}
							>
								{/* バー（最初から表示） */}
								<motion.div
									className="absolute inset-0 bg-primary rounded-full"
									style={{
										opacity: useTransform(activeIndex, (active) =>
											active === index ? 1 : 0.3,
										),
									}}
								/>

								{/* アクティブインジケーター */}
								<motion.div
									className="absolute -bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 bg-primary rounded-full"
									style={{
										opacity: useTransform(activeIndex, (active) =>
											active === index ? 1 : 0,
										),
									}}
								/>
							</motion.div>
						))}
					</div>
				</div>

				{/* プロジェクト名 */}
				<div className="absolute bottom-32 left-0 right-0">
					<div className="container mx-auto px-4">
						{works.map((work, index) => (
							<motion.div
								key={work.id}
								className="text-center"
								style={{
									opacity: useTransform(activeIndex, (active) =>
										active === index ? 1 : 0,
									),
									display: useTransform(activeIndex, (active) =>
										active === index ? "block" : "none",
									),
									position: "absolute",
									width: "100%",
									left: "50%",
									transform: "translateX(-50%)",
								}}
							>
								<h3 className="text-4xl font-bold text-white">{work.title}</h3>
								<p className="mt-4 text-lg text-white/80">{work.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
