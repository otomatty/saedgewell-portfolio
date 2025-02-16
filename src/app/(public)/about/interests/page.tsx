import { Hero } from "@/components/custom/Hero";
import Aspirations from "./_components/Aspirations";
import InterestsList from "./_components/InterestsList";

const InterestsPage = () => {
	return (
		<div>
			<Hero
				title="興味関心"
				description="私の技術的な興味関心や、その他の分野への興味についてご紹介します。"
			/>
			<InterestsList />
			<Aspirations />
		</div>
	);
};

export default InterestsPage;
