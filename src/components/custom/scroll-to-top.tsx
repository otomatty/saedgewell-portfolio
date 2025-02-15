"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	// スクロール位置を監視
	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	// トップにスクロール
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div
			className={cn(
				"fixed bottom-8 right-8 z-50 transition-opacity duration-300",
				isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
			)}
		>
			<Button
				variant="outline"
				size="icon"
				className="relative w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90 [&>svg]:size-6 [&>svg]:shrink-0"
				onClick={scrollToTop}
			>
				<ArrowUp className="w-10 h-10 text-foreground" />
			</Button>
		</div>
	);
};
