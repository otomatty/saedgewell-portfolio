import { ComponentDetail } from "../../_components/ComponentDetail";
import { getComponentDoc } from "../../utils";
import { BentoGrid, BentoCard, MagicBentoCard } from "@/components/bento-grid";
import { FileIcon, ImageIcon, VideoIcon } from "lucide-react";

const CATEGORY = {
	id: "layout",
	label: "Layout",
};

export default async function BentoGridPage() {
	const component = await getComponentDoc("bento-grid");
	if (!component) return null;

	return (
		<>
			<ComponentDetail component={component} category={CATEGORY} />
			<div className="container mb-20">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="mb-4 text-xl font-semibold">プレビュー</h2>
					<div className="space-y-8">
						<div>
							<h3 className="mb-4 text-lg font-medium">Basic Cards</h3>
							<BentoGrid>
								<BentoCard
									name="ドキュメント"
									className="col-span-4"
									background={
										<div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800" />
									}
									icon="file"
									description="プロジェクトのドキュメントを管理"
									href="#"
									cta="表示"
								/>
								<BentoCard
									name="画像"
									className="col-span-4"
									background={
										<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" />
									}
									icon="image"
									description="プロジェクトの画像アセット"
									href="#"
									cta="表示"
								/>
								<BentoCard
									name="動画"
									className="col-span-4"
									background={
										<div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800" />
									}
									icon="video"
									description="プロジェクトの動画コンテンツ"
									href="#"
									cta="表示"
								/>
							</BentoGrid>
						</div>

						<div>
							<h3 className="mb-4 text-lg font-medium">Magic Cards</h3>
							<BentoGrid>
								<MagicBentoCard
									name="マジックカード1"
									className="col-span-6"
									background={
										<div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800" />
									}
									icon="file"
									description="マウスに反応するグラデーションエフェクト"
									href="#"
									cta="表示"
								/>
								<MagicBentoCard
									name="マジックカード2"
									className="col-span-6"
									background={
										<div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800" />
									}
									icon="image"
									description="インタラクティブなホバーエフェクト"
									href="#"
									cta="表示"
								/>
							</BentoGrid>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
