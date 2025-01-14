import HeroSection from "./_components/home/HeroSection";
import SkillsHighlight from "./_components/home/SkillsHighlight";
import LatestProjects from "./_components/home/LatestProjects";

export default function Home() {
	return (
		<div className="min-h-screen">
			<HeroSection />
			<SkillsHighlight />
			<LatestProjects />
		</div>
	);
}
