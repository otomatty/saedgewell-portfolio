import type { Metadata } from "next";
import { Hero } from "@/components/custom/Hero";
import { PricingSection } from "./components/PricingSection";
import { PricingFAQ } from "./components/PricingFAQ";
import { deliverables, faqs } from "../../../data/pricing";

export const metadata: Metadata = {
	title: "料金",
	description: "各種成果物の料金体系をご確認いただけます。",
};

export default function PricingPage() {
	return (
		<main>
			<Hero
				title="料金"
				description="各種成果物の料金体系をご確認いただけます。"
				pattern="dots"
				size="lg"
			/>
			<div className="container py-20">
				{deliverables.map((category) => (
					<PricingSection
						key={category.category}
						category={category.category}
						items={category.items}
					/>
				))}
				<PricingFAQ faqs={faqs} />
			</div>
		</main>
	);
}
