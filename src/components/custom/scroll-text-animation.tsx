"use client";

import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface ScrollTextAnimationProps {
	text: string;
	className?: string;
	initialFontSize?: number; // 初期フォントサイズ（px）
	onAnimationComplete?: () => void;
}

/**
 * イージング関数：前半は緩やかに、後半は急激に値が変化する
 * @param x - 0から1の間の進行度
 */
const easeInExpo = (x: number): number => {
	return x === 0 ? 0 : 2 ** (10 * x - 10);
};

// フリップアニメーションのバリアント
const flipVariants = {
	hidden: { rotateX: 90, opacity: 0 },
	visible: { rotateX: 0, opacity: 1 },
	exit: { rotateX: -90, opacity: 0 },
};

/**
 * 文字が日本語かどうかを判定
 */
const isJapanese = (char: string): boolean => {
	return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(
		char,
	);
};

/**
 * スクロールに応じてテキストが拡大し、3D効果で奥に吸い込まれていくようなアニメーションを実現するコンポーネント
 * SVGテキストを使用することで、拡大時もクリアな表示を維持
 * @param text - アニメーションするテキスト
 * @param className - 追加のスタイルクラス
 * @param initialFontSize - 初期フォントサイズ（px）
 * @param onAnimationComplete - アニメーション完了時のコールバック
 */
export const ScrollTextAnimation = ({
	text,
	className,
	initialFontSize = 32, // デフォルト値を72pxに設定
	onAnimationComplete,
}: ScrollTextAnimationProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isInView, setIsInView] = useState(false);
	const [shouldAnimate, setShouldAnimate] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isScrollingUp, setIsScrollingUp] = useState(false);

	// スクロール方向の検知
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setIsScrollingUp(currentScrollY < lastScrollY);
			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	// Intersection Observerの設定
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !shouldAnimate) {
					setShouldAnimate(true);
				}
				setIsInView(entry.isIntersecting);
			},
			{
				threshold: [0, 0.1, 0.9, 1], // より細かい検知のために閾値を追加
			},
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, [shouldAnimate]);

	// スクロール進捗を取得（セクション全体の高さに対する進捗を計測）
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"], // セクション全体の開始から終了までを計測
	});

	// イージング関数を適用したスケール値を計算
	const scale = useTransform(scrollYProgress, [0, 0.95], [1, 120], {
		ease: easeInExpo,
	});

	const opacity = useTransform(
		scrollYProgress,
		[0, 0.1, 0.3, 0.8, 0.9, 1],
		[0, 1, 1, 1, 0, 0],
		{
			ease: easeInExpo,
		},
	);

	const y = useTransform(scrollYProgress, [0, 1], [0, -50], {
		ease: easeInExpo,
	});

	// アニメーション完了の監視
	useEffect(() => {
		const unsubscribe = scrollYProgress.on("change", (latest) => {
			if (latest >= 1 && onAnimationComplete) {
				onAnimationComplete();
			}
		});

		return () => unsubscribe();
	}, [scrollYProgress, onAnimationComplete]);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full flex items-center justify-center"
		>
			{isInView && (
				<div className="fixed inset-0 flex items-center justify-center pointer-events-none">
					<motion.div
						className="w-full max-w-4xl px-4"
						style={{
							scale,
							opacity,
							y,
						}}
					>
						<svg
							className={`w-full h-auto ${className ?? ""}`}
							viewBox="-50 -20 600 140"
							preserveAspectRatio="xMidYMid meet"
							aria-label={`Animated text: ${text}`}
							role="img"
						>
							<defs>
								<style type="text/css">
									{`
										@font-face {
											font-family: 'SVGFont';
											src: local('Inter');
										}
									`}
								</style>
							</defs>
							<AnimatePresence mode="wait">
								<motion.text
									key={`text-${shouldAnimate}`}
									x="250"
									y="50"
									dominantBaseline="middle"
									textAnchor="middle"
									fill="currentColor"
									style={{
										fontFamily: "SVGFont, Inter, sans-serif",
										fontSize: `${initialFontSize}px`,
										fontWeight: "bold",
									}}
								>
									{text.split("").map((char, i) => (
										<motion.tspan
											key={`${char}-${i}-${shouldAnimate}`}
											initial="hidden"
											animate="visible"
											exit="exit"
											variants={flipVariants}
											transition={{
												duration: 0.5,
												delay: shouldAnimate ? i * 0.08 : 0,
											}}
											dx={i === 0 ? 0 : isJapanese(char) ? "-0.05em" : "0em"}
											style={{
												transformOrigin: "center center",
											}}
										>
											{char}
										</motion.tspan>
									))}
								</motion.text>
							</AnimatePresence>
						</svg>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default ScrollTextAnimation;
