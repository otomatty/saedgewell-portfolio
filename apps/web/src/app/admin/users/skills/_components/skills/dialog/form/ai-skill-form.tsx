"use client";

import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { SkillCategory } from "@/types/skill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	generateSkills,
	type GeneratedSkill,
	type SkillCategory as SkillCategoryType,
} from "@/lib/gemini/skills";
import { SkillSuggestionCard } from "./skill-suggestion-card";
import type { ManualSkillFormData } from "./manual-skill-form";

interface Props {
	categories: SkillCategory[];
	setValue: UseFormSetValue<ManualSkillFormData>;
	onSelect?: () => void;
}

export function AISkillForm({ categories, setValue, onSelect }: Props) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<SkillCategoryType>();
	const [description, setDescription] = useState<string>();
	const [suggestions, setSuggestions] = useState<GeneratedSkill[]>([]);

	const handleGenerateSkills = async () => {
		try {
			setIsGenerating(true);
			const generatedSkills = await generateSkills({
				category: selectedCategory as SkillCategoryType,
				description,
			});
			setSuggestions(generatedSkills);
		} catch (error) {
			console.error("Failed to generate skills:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSelectSuggestion = (suggestion: GeneratedSkill) => {
		setValue("name", suggestion.name);
		setValue("slug", suggestion.slug);
		setValue("description", suggestion.description);
		setValue("icon_url", suggestion.icon_url);
		setValue("started_at", new Date());
		onSelect?.();
	};

	return (
		<div className="space-y-4 rounded-lg border p-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>カテゴリー</Label>
					<Select
						value={selectedCategory}
						onValueChange={(value) => {
							setSelectedCategory(value as SkillCategoryType);
							setValue("categories", value.split(","));
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="カテゴリーを選択" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Textarea
					placeholder="追加の要件があれば入力してください"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<Button
					type="button"
					onClick={handleGenerateSkills}
					disabled={isGenerating || !selectedCategory}
				>
					{isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					スキルを生成
				</Button>
			</div>

			{suggestions.length > 0 && (
				<div className="mt-4 space-y-2">
					{suggestions.map((suggestion) => (
						<SkillSuggestionCard
							key={suggestion.slug}
							{...suggestion}
							onSelect={() => handleSelectSuggestion(suggestion)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
