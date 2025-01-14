"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import type { CategoryWithSkills } from "../types";

type Props = {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	selectedCategory: string;
	setSelectedCategory: (value: string) => void;
	selectedLevel: string;
	setSelectedLevel: (value: string) => void;
	skillsByCategory: CategoryWithSkills[];
	getLevelText: (level: number) => string;
};

export default function SkillFilters({
	searchQuery,
	setSearchQuery,
	selectedCategory,
	setSelectedCategory,
	selectedLevel,
	setSelectedLevel,
	skillsByCategory,
	getLevelText,
}: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="flex flex-col sm:flex-row gap-4 mb-8"
		>
			<Input
				placeholder="スキルを検索..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="sm:max-w-xs"
			/>
			<Select value={selectedCategory} onValueChange={setSelectedCategory}>
				<SelectTrigger className="sm:max-w-xs">
					<SelectValue placeholder="カテゴリーを選択" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべてのカテゴリー</SelectItem>
					{skillsByCategory.map((category) => (
						<SelectItem key={category.name} value={category.name}>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={selectedLevel} onValueChange={setSelectedLevel}>
				<SelectTrigger className="sm:max-w-xs">
					<SelectValue placeholder="レベルを選択" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべてのレベル</SelectItem>
					{[1, 2, 3, 4, 5].map((level) => (
						<SelectItem key={level} value={level.toString()}>
							{getLevelText(level)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</motion.div>
	);
}
