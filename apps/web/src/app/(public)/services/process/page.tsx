import type { Metadata } from "next";
import { BasicHero } from "../../../../components/custom/basic-hero";
import { ProcessSection } from "./components/ProcessSection";
import { CTASection } from "../../_components/CTASection";
import { processes } from "./data/process";

export const metadata: Metadata = {
	title: "開発プロセス",
	description:
		"プロジェクトの進め方や各フェーズでの成果物について詳しくご説明します。",
};

const processDetails = {
	introduction: {
		title: "プロジェクトの進め方",
		description:
			"プロジェクトの成功には、明確なプロセスと綿密なコミュニケーションが不可欠です。各フェーズで必要な成果物を作成し、お客様との合意を得ながら進めていきます。",
	},
	benefits: [
		{
			title: "透明性の高いプロジェクト管理",
			description:
				"定期的な進捗報告と成果物の共有により、プロジェクトの状況を常に把握できます。",
		},
		{
			title: "品質を重視した開発プロセス",
			description:
				"各フェーズでの品質チェックと承認プロセスにより、高品質な成果物を提供します。",
		},
		{
			title: "柔軟な対応と迅速なフィードバック",
			description:
				"開発中の変更要望やフィードバックに柔軟に対応し、お客様の期待に応える成果物を作り上げます。",
		},
	],
};

export default function ProcessPage() {
	return (
		<main>
			<BasicHero
				title="開発プロセス"
				description="プロジェクトの進め方や各フェーズでの成果物について詳しくご説明します。"
				pattern="dots"
				size="lg"
			/>
			<div className="container py-20">
				<section className="mb-20">
					<h2 className="text-3xl font-bold mb-8">
						{processDetails.introduction.title}
					</h2>
					<p className="text-muted-foreground mb-12 max-w-2xl">
						{processDetails.introduction.description}
					</p>
					<div className="grid md:grid-cols-3 gap-8 mb-20">
						{processDetails.benefits.map((benefit, index) => (
							<div
								key={benefit.title}
								className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
							>
								<h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
								<p className="text-muted-foreground">{benefit.description}</p>
							</div>
						))}
					</div>
				</section>

				<ProcessSection processes={processes} />

				<section className="mb-20">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">プロジェクトのご相談</h2>
						<p className="text-muted-foreground mb-8">
							プロジェクトについてのご相談は、お気軽にお問い合わせください。
							要件定義から運用保守まで、一貫してサポートいたします。
						</p>
					</div>
				</section>

				<CTASection />
			</div>
		</main>
	);
}
