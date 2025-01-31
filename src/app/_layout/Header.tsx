"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "./Navigation";
import { MobileNavigation } from "./MobileNavigation";

export const Header = () => {
	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<div className="container flex h-16 items-center">
				<div className="mr-8">
					<Link href="/" className="text-xl font-bold">
						Saedgewell
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-end space-x-4">
					<Navigation />
					<Button asChild>
						<Link href="/contact">お問い合わせ</Link>
					</Button>
					<MobileNavigation />
				</div>
			</div>
		</motion.header>
	);
};
