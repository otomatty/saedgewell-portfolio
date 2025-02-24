"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../components/ui/select";
import { WorkCard } from "../../../../components/custom/achievements/work-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Work, WorkCategory } from "../../../../types/work";
import { SectionTitle } from "../../../../components/custom/section-title";

interface AdditionalAchievementsProps {
	works: Work[];
}

const CATEGORIES: { label: string; value: WorkCategory }[] = [
	{ label: "企業案件", value: "company" },
	{ label: "フリーランス", value: "freelance" },
	{ label: "個人開発", value: "personal" },
];

/**
 * 追加の実績を表示するセクション
 * グリッドレイアウトでフェードインアニメーション付きで表示
 * フィルターと検索機能付き
 */
export const AdditionalAchievements = ({
	works,
}: AdditionalAchievementsProps) => {
	const [selectedCategory, setSelectedCategory] = useState<
		WorkCategory | "all"
	>("all");
	const [searchQuery, setSearchQuery] = useState("");

	// フィルタリングと検索を適用
	const filteredWorks = works.filter((work) => {
		const matchesCategory =
			selectedCategory === "all" || work.category === selectedCategory;
		const matchesSearch = work.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<section className="py-16 bg-background/50">
			<div className="container mx-auto px-4">
				<SectionTitle
					title="Other Works"
					subtitle="その他の実績一覧"
					align="center"
					className="mb-12"
				/>

				{/* フィルターと検索 */}
				<div className="flex flex-col sm:flex-row gap-4 mb-8">
					<Select
						value={selectedCategory}
						onValueChange={(value) =>
							setSelectedCategory(value as WorkCategory | "all")
						}
					>
						<SelectTrigger className="w-full sm:w-[200px]">
							<SelectValue placeholder="カテゴリー" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">すべて</SelectItem>
							{CATEGORIES.map((category) => (
								<SelectItem key={category.value} value={category.value}>
									{category.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						placeholder="プロジェクトを検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full sm:w-[300px]"
					/>
				</div>

				{/* 実績グリッド */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
					{filteredWorks.map((work, index) => (
						<motion.div
							key={work.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							viewport={{ once: true }}
							className="h-full"
						>
							<WorkCard work={work} />
						</motion.div>
					))}
				</div>

				{/* 実績が見つからない場合 */}
				{filteredWorks.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							条件に一致する実績が見つかりませんでした
						</p>
					</div>
				)}

				{/* 実績一覧ページへの誘導 */}
				<div className="text-center mt-12">
					<Button variant="outline" asChild>
						<Link href="/works" className="group">
							すべての実績を見る
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};
