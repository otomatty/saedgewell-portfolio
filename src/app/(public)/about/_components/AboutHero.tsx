"use client";

import { Hero } from "@/components/custom/hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";
import { ContactDialog } from "@/components/custom/contact/contact-dialog";

export const AboutHero = () => {
	return (
		<Hero
			title="About Me"
			description="プロダクトエンジニアとして、モダンな技術を活用したWeb開発に携わっています。"
			pattern="dots"
			size="lg"
			align="left"
		>
			<div className="flex flex-col sm:flex-row gap-4">
				<ContactDialog />
				<div className="flex gap-2">
					<Button variant="outline" size="icon" asChild>
						<Link
							href="https://github.com/saedgewell"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github className="h-4 w-4" />
							<span className="sr-only">GitHubプロフィール</span>
						</Link>
					</Button>
					<Button variant="outline" size="icon" asChild>
						<Link
							href="https://twitter.com/saedgewell"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Twitter className="h-4 w-4" />
							<span className="sr-only">Xプロフィール</span>
						</Link>
					</Button>
				</div>
			</div>
		</Hero>
	);
};
