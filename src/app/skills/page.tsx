"use client";

import { motion } from "framer-motion";
import { getSkillsByCategory } from "@/data/skills";
import { useState } from "react";
import SkillCard from "./_components/SkillCard";
import SkillFilters from "./_components/SkillFilters";
import { getLevelText } from "@/lib/utils/skill";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function SkillsPage() {
	const skillsByCategory = getSkillsByCategory();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedLevel, setSelectedLevel] = useState("all");

	const filteredCategories = skillsByCategory
		.map((category) => ({
			...category,
			skills: category.skills.filter(
				(skill) =>
					(skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						skill.description
							?.toLowerCase()
							.includes(searchQuery.toLowerCase())) &&
					(selectedLevel === "all" || skill.level === Number(selectedLevel)),
			),
		}))
		.filter(
			(category) =>
				selectedCategory === "all" || category.name === selectedCategory,
		)
		.filter((category) => category.skills.length > 0);

	return (
		<div className="min-h-screen py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-4xl font-bold text-center mb-12"
				>
					スキル一覧
				</motion.h1>

				<SkillFilters
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					selectedLevel={selectedLevel}
					setSelectedLevel={setSelectedLevel}
					skillsByCategory={skillsByCategory}
					getLevelText={getLevelText}
				/>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="space-y-12"
				>
					{filteredCategories.map((category) => (
						<motion.section key={category.name} variants={item}>
							<h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{category.skills.map((skill) => (
									<SkillCard
										key={skill.id}
										skill={skill}
										getLevelText={getLevelText}
									/>
								))}
							</div>
						</motion.section>
					))}

					{filteredCategories.length === 0 && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center text-muted-foreground"
						>
							該当するスキルが見つかりませんでした
						</motion.p>
					)}
				</motion.div>
			</div>
		</div>
	);
}
