import type { Metadata } from "next";
import { AboutHero } from "./_components/AboutHero";
import { AboutHeader } from "./_components/AboutHeader";
import { Career } from "./_components/Career";
import { Values } from "./_components/Values";
import { TechStack } from "./_components/TechStack";
import { Certifications } from "./_components/Certifications";
import { Interests } from "./_components/Interests";
import { Featured } from "./_components/Featured";

export const metadata: Metadata = {
	title: "About Me",
	description:
		"プロダクトエンジニアとして、モダンな技術を活用したWeb開発に携わっています。",
};

export default function AboutPage() {
	return (
		<main>
			<AboutHero />
			<div className="container py-20 space-y-32">
				<AboutHeader />
				<Career />
				<Values />
				<TechStack />
				<Certifications />
				<Interests />
				<Featured />
			</div>
		</main>
	);
}
