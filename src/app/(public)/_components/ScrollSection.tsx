"use client";

import ScrollFadeText from "@/components/custom/scroll-fade-text";
import ScrollTextAnimation from "@/components/custom/scroll-text-animation";

/**
 * スクロールアニメーションを含むセクションコンポーネント
 */
export const ScrollSection = () => {
	return (
		<section className="relative w-full">
			{/* 1. 最初のフェードアニメーション */}
			<div className="h-[300vh]">
				<ScrollFadeText
					text="Welcome to"
					className="text-primary"
					fontSize={64}
				/>
			</div>

			{/* 2. 2番目のフェードアニメーション */}
			<div className="h-[300vh]">
				<ScrollFadeText
					text="My Portfolio"
					className="text-primary"
					fontSize={64}
				/>
			</div>

			{/* 3. 拡大するテキストアニメーション */}
			<div className="h-[500vh]">
				<ScrollTextAnimation
					text="Portfolio"
					className="text-primary"
					initialFontSize={64}
				/>
			</div>
		</section>
	);
};

export default ScrollSection;
