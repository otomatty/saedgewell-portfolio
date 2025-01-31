import { Hero } from "./_components/Hero";
import { Introduction } from "./_components/Introduction";
import { Achievements } from "./_components/Achievements";
import { Skills } from "./_components/Skills";
import { CTASection } from "./_components/CTASection";

export default function HomePage() {
	return (
		<main className="min-h-screen">
			<Hero />
			<Introduction />
			<Achievements />
			<Skills />
			<CTASection />
		</main>
	);
}
