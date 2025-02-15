"use client";

import { useRef, useState, useEffect } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useMotionValueEvent,
	AnimatePresence,
} from "framer-motion";
import type { FeaturedWork } from "@/types/work";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { ScrollTextAnimation } from "@/components/custom/scroll-text-animation";

interface AchievementsProps {
	works: FeaturedWork[];
}

/**
 * 実績を表示するコンポーネント
 * スクロールに応じてバーが上に移動し、背景画像とプロジェクト名が切り替わる
 * バーをクリックすると対応するセクションまでスクロール
 */
export const Achievements = ({ works }: AchievementsProps) => {
	// スクロールアニメーションの設定値
	const FADE_IN_START = 0.2;
	const FADE_IN_COMPLETE = 0.4;
	const ANIMATION_START_OFFSET = 0.05;
	const ANIMATION_DURATION = 0.4;
	const FADE_OUT_START = 0.8;
	const FADE_OUT_COMPLETE = 0.9;

	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	const [currentIndex, setCurrentIndex] = useState(0);

	// アクティブなインデックスを計算（数値として扱う）
	const activeIndex = useTransform(scrollYProgress, (value) => {
		// コンテナが完全に表示される0.4以降からバーのアニメーションを開始
		if (value < FADE_IN_COMPLETE) return -1;

		// アニメーション範囲を0-1に正規化
		const normalizedValue =
			(value - (FADE_IN_COMPLETE + ANIMATION_START_OFFSET)) / //ここだけANIMATION_START_OFFSETを足して調整
			ANIMATION_DURATION;

		const totalSections = works.length + 2;
		const rawIndex = Math.round(normalizedValue * (totalSections - 1));
		const adjustedIndex = rawIndex - 1;
		return Math.min(Math.max(-1, adjustedIndex), works.length);
	});

	useMotionValueEvent(activeIndex, "change", (latest) => {
		setCurrentIndex(latest);
	});

	// バーをクリックした時の処理
	const handleBarClick = (index: number) => {
		if (!containerRef.current) return;

		// 全体の高さを取得
		const containerHeight = containerRef.current.scrollHeight;

		// コンテナのフェードイン完了位置（40%地点）からの相対位置を計算
		const fadeInCompletePosition = containerHeight * FADE_IN_COMPLETE;
		const remainingHeight = containerHeight * ANIMATION_DURATION; // 0.4-0.8の範囲で使用

		const totalSections = works.length + 2;
		const sectionHeight = remainingHeight / totalSections;

		const targetScrollPosition =
			containerRef.current.offsetTop +
			fadeInCompletePosition +
			(index + 1) * sectionHeight;

		// スクロール実行
		window.scrollTo({
			top: targetScrollPosition,
			behavior: "smooth",
		});
	};

	// アニメーションの設定を調整
	const transition = {
		duration: 0.5,
		ease: [0.32, 0.72, 0, 1],
		type: "spring",
		stiffness: 100,
		damping: 15,
	};

	// バーのアニメーション用のバリアント
	const barVariants = {
		active: {
			y: -30,
			opacity: 1,
			transition,
		},
		inactive: {
			y: 0,
			opacity: 0.3,
			transition,
		},
	};

	// インジケーターのアニメーション用のバリアント
	const indicatorVariants = {
		active: {
			opacity: 1,
			scale: 1,
			x: "-50%",
			transition,
		},
		inactive: {
			opacity: 0,
			scale: 0.5,
			x: "-50%",
			transition,
		},
	};

	// コンテンツのアニメーション用のバリアント
	const contentVariants = {
		active: {
			opacity: 1,
			y: 0,
			transition: {
				...transition,
				delay: 0.2,
			},
		},
		inactive: {
			opacity: 0,
			y: 20,
			transition,
		},
	};

	// Rippleアニメーション用のバリアント
	const rippleVariants = {
		initial: {
			opacity: 0.5,
			scale: 1,
		},
		animate: {
			opacity: 0,
			scale: 2,
			transition: {
				repeat: Number.POSITIVE_INFINITY,
				duration: 1.5,
				ease: "easeOut",
			},
		},
	};

	// 固定コンテナのアニメーション用のスクロール進捗
	const containerScrollProgress = useTransform(
		scrollYProgress,
		[FADE_IN_START, FADE_IN_COMPLETE, FADE_OUT_START, FADE_OUT_COMPLETE],
		[0, 1, 1, 0],
	);

	// 表示/非表示の状態を管理
	const isVisible = useTransform(
		scrollYProgress,
		[0, FADE_IN_START, FADE_OUT_COMPLETE, 1],
		[false, true, true, false],
	);

	const [shouldRender, setShouldRender] = useState(false);

	useMotionValueEvent(isVisible, "change", (latest) => {
		setShouldRender(latest);
	});

	// スケールとオパシティの変換
	const containerScale = useTransform(
		containerScrollProgress,
		[0, 1],
		[0.8, 1],
	);
	const containerOpacity = useTransform(
		containerScrollProgress,
		[0, 1],
		[0, 1],
	);
	const containerZ = useTransform(containerScrollProgress, [0, 1], [-100, 0]);

	return (
		<section ref={containerRef} className="relative h-[1000vh]">
			{/* スクロールテキストアニメーション */}
			<div className="h-[300vh]">
				<ScrollTextAnimation
					text="実績の一部をご紹介します"
					initialFontSize={32}
				/>
			</div>

			{/* 固定コンテナ */}
			<AnimatePresence>
				{shouldRender && (
					<motion.div
						className="fixed inset-0 h-screen"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							style={{
								scale: containerScale,
								opacity: containerOpacity,
								z: containerZ,
								perspective: "1000px",
								transformStyle: "preserve-3d",
							}}
							className="w-full h-full"
						>
							<NeonGradientCard className="w-[70%] h-[70%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								{/* 背景画像コンテナ */}
								<div className="absolute inset-0 w-full h-full rounded-2xl">
									{works.map((work, index) => (
										<motion.div
											key={work.id}
											className="absolute inset-0 w-full h-full rounded-2xl"
											animate={currentIndex === index ? "active" : "inactive"}
											variants={{
												active: {
													opacity: 1,
													scale: 1,
													transition,
												},
												inactive: {
													opacity: 0,
													scale: 0.95,
													transition,
												},
											}}
											style={{
												backgroundImage: `url(${work.thumbnail_url})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}}
										>
											{/* 暗いフィルター */}
											<div className="absolute inset-0 bg-black/40 dark:bg-white/20 rounded-2xl" />
										</motion.div>
									))}
								</div>

								{/* バーコンテナ */}
								<div className="relative flex items-center justify-center z-20">
									<div className="flex gap-6 px-4 mt-12">
										{/* 実績用のバー */}
										{works.map((work, index) => (
											<motion.div
												key={work.id}
												className="relative w-8 h-[40vh] cursor-pointer"
												animate={currentIndex === index ? "active" : "inactive"}
												variants={barVariants}
												onClick={() => handleBarClick(index)}
											>
												{/* バー */}
												<div className="absolute inset-0 bg-primary rounded-full" />

												{/* アクティブインジケーター */}
												<motion.div
													className="absolute -bottom-4 left-1/2 w-2 h-2 bg-primary rounded-full"
													animate={
														currentIndex === index ? "active" : "inactive"
													}
													variants={indicatorVariants}
													initial="inactive"
												>
													<AnimatePresence>
														{currentIndex === index && (
															<motion.div
																className="absolute inset-0 bg-primary rounded-full"
																variants={rippleVariants}
																initial="initial"
																animate="animate"
															/>
														)}
													</AnimatePresence>
												</motion.div>
											</motion.div>
										))}
									</div>
								</div>

								{/* 実績名 */}
								<div className="absolute bottom-24 left-0 right-0 z-30">
									<div className="container mx-auto px-4">
										<AnimatePresence mode="wait">
											{works.map(
												(work, index) =>
													currentIndex === index && (
														<motion.div
															key={work.id}
															className="text-center"
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -20 }}
															transition={{
																duration: 0.5,
																ease: [0.32, 0.72, 0, 1],
															}}
														>
															<h3 className="text-4xl font-bold text-white mb-4">
																{work.title}
															</h3>
															<p className="text-lg text-white/80 max-w-2xl mx-auto">
																{work.description}
															</p>
														</motion.div>
													),
											)}
										</AnimatePresence>
									</div>
								</div>
							</NeonGradientCard>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
};
