"use client";

import ScrollFadeText from "@/components/custom/scroll-fade-text";

/**
 * スクロールフェードアニメーションを含むセクションコンポーネント
 */
export const ScrollFadeSection = () => {
	return (
		<section className="relative w-full h-[300vh]">
			<ScrollFadeText
				text="Scroll to Fade"
				className="text-primary"
				fontSize={64}
			/>
		</section>
	);
};

export default ScrollFadeSection;
