"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WorkCard } from "./WorkCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/types/supabase";

type Work = Database["public"]["Tables"]["works"]["Row"] & {
	work_technologies: {
		technologies: Database["public"]["Tables"]["technologies"]["Row"];
	}[];
};

type Technology = Database["public"]["Tables"]["technologies"]["Row"];

interface WorksFilterProps {
	works: Work[];
	technologies: Technology[];
}

export function WorksFilter({ works, technologies = [] }: WorksFilterProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedTech, setSelectedTech] = useState<string | null>(null);

	// フィルタリングされた作品を取得
	const filteredWorks = works.filter((work) => {
		const matchesSearch =
			work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			work.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			selectedCategory === "all" || work.category === selectedCategory;

		const matchesTech =
			!selectedTech ||
			work.work_technologies.some(
				({ technologies }) => technologies?.name === selectedTech,
			);

		return matchesSearch && matchesCategory && matchesTech;
	});

	const categories = [
		{ value: "all", label: "すべて" },
		{ value: "company", label: "企業案件" },
		{ value: "freelance", label: "フリーランス" },
		{ value: "personal", label: "個人開発" },
	];

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<Input
					type="search"
					placeholder="プロジェクトを検索..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>

				<div className="flex flex-col items-center space-y-4">
					<Tabs
						value={selectedCategory}
						onValueChange={setSelectedCategory}
						className="w-full max-w-[600px]"
					>
						<TabsList className="grid w-full grid-cols-4">
							{categories.map((category) => (
								<TabsTrigger key={category.value} value={category.value}>
									{category.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<p className="text-sm text-muted-foreground">
						{selectedCategory === "all"
							? `全${works.length}件の実績`
							: `${
									works.filter((work) => work.category === selectedCategory)
										.length
								}件の実績`}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{technologies?.map((tech) => (
						<Badge
							key={tech.id}
							variant={selectedTech === tech.name ? "default" : "outline"}
							className="cursor-pointer"
							onClick={() =>
								setSelectedTech(selectedTech === tech.name ? null : tech.name)
							}
						>
							{tech.name}
						</Badge>
					))}
				</div>
			</div>

			<motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<AnimatePresence mode="popLayout">
					{filteredWorks.map((work) => (
						<motion.div
							key={work.slug}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3 }}
						>
							<WorkCard {...work} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			{filteredWorks.length === 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-12"
				>
					<p className="text-lg text-muted-foreground">
						条件に一致するプロジェクトが見つかりませんでした。
					</p>
				</motion.div>
			)}
		</div>
	);
}
