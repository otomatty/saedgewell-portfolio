"use client";

import { useHydrateAtoms } from "jotai/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { skillsAtom, categoriesAtom } from "../../../../store/admin/skills";
import type { Skill, SkillCategory } from "../../../../types/skill";
import { DataTable } from "../../../../components/ui/data-table";
import { skillColumns } from "./skills/table/columns";
import { categoryColumns } from "./categories/table/columns";
import { ErrorBoundary } from "../../../../components/custom/error-boundary";
import { ErrorMessage } from "../../../../components/custom/error-message";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../../components/ui/tabs";
import { useToast } from "../../../../hooks/use-toast";
import type { z } from "zod";
import type { formSchema } from "./skills/dialog/skill-form";
import { CreateSkillDialog } from "./skills/dialog/create-skill-dialog";

type FormData = z.infer<typeof formSchema>;

interface SkillsViewProps {
	initialSkills: Skill[];
	initialCategories: SkillCategory[];
}

/**
 * スキル管理ページのコンテンツ
 * - Tabsを使用してスキル一覧とカテゴリー一覧を表示
 * - useHydrateAtomsを使用して初期データをatomにhydrate
 * @param {SkillsViewProps} props
 * @returns {JSX.Element}
 */
function SkillsViewContent({
	initialSkills,
	initialCategories,
}: SkillsViewProps) {
	// 初期データをatomにhydrate
	useHydrateAtoms([
		[skillsAtom, initialSkills],
		[categoriesAtom, initialCategories],
	]);

	const { toast } = useToast();
	const skills = useAtomValue(skillsAtom);
	const categories = useAtomValue(categoriesAtom);
	const setSkills = useSetAtom(skillsAtom);

	const handleCreateSkill = async (values: FormData) => {
		try {
			// TODO: スキル作成のServer Actionを呼び出す
			console.log("Create skill:", values);

			// 成功時の処理
			toast({
				title: "スキルを追加しました",
				description: "新しいスキルが正常に追加されました。",
			});
		} catch (error) {
			console.error("Failed to create skill:", error);
			toast({
				title: "エラー",
				description:
					error instanceof Error ? error.message : "スキルの追加に失敗しました",
				variant: "destructive",
			});
		}
	};

	return (
		<Tabs defaultValue="skills" className="space-y-4">
			<TabsList>
				<TabsTrigger value="skills">スキル一覧</TabsTrigger>
				<TabsTrigger value="categories">カテゴリー一覧</TabsTrigger>
			</TabsList>
			<TabsContent value="skills">
				<div className="space-y-4">
					<DataTable
						columns={skillColumns}
						data={skills}
						create={{
							content: (
								<CreateSkillDialog
									categories={categories}
									onSubmit={handleCreateSkill}
								/>
							),
						}}
					/>
				</div>
			</TabsContent>
			<TabsContent value="categories">
				<div className="space-y-4">
					<DataTable columns={categoryColumns} data={categories} />
				</div>
			</TabsContent>
		</Tabs>
	);
}

export function SkillsView(props: SkillsViewProps) {
	return (
		<ErrorBoundary
			fallback={
				<ErrorMessage
					title="データの読み込みエラー"
					description="情報の読み込みに失敗しました。再度お試しください。"
				/>
			}
		>
			<SkillsViewContent {...props} />
		</ErrorBoundary>
	);
}
