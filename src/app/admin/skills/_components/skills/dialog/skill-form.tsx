"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Skill, SkillCategory } from "@/types/skill";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
	ManualSkillForm,
	type ManualSkillFormData,
} from "./form/manual-skill-form";
import { AISkillForm } from "./form/ai-skill-form";
import { useSkillForm } from "./form/use-skill-form";

export const formSchema = z.object({
	name: z.string().min(1, "必須項目です"),
	slug: z.string().min(1, "必須項目です"),
	description: z.string().min(1, "必須項目です"),
	categories: z.array(z.string()).min(1, "必須項目です"),
	icon_url: z.string().nullable(),
	started_at: z.date(),
});

interface Props {
	defaultValues?: Partial<Skill>;
	categories: SkillCategory[];
	onSuccess?: () => void;
	onCancel: () => void;
}

export function SkillForm({
	defaultValues,
	categories,
	onSuccess,
	onCancel,
}: Props) {
	const [activeTab, setActiveTab] = useState<string>("manual");
	const { toast } = useToast();

	const { isSubmitting, handleSubmit } = useSkillForm({
		skill: defaultValues as Skill,
		onSuccess: () => {
			toast({
				title: defaultValues ? "スキルを更新しました" : "スキルを作成しました",
			});
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: "エラーが発生しました",
				description: error.message,
			});
		},
	});

	const form = useForm<ManualSkillFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: defaultValues?.name ?? "",
			slug: defaultValues?.slug ?? "",
			description: defaultValues?.description ?? "",
			categories: defaultValues?.categories?.map((c) => c.name) ?? [],
			icon_url: defaultValues?.icon_url ?? null,
			started_at: defaultValues?.started_at
				? new Date(defaultValues.started_at)
				: new Date(),
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="manual">手動入力</TabsTrigger>
						<TabsTrigger value="ai">AI生成</TabsTrigger>
					</TabsList>

					<TabsContent value="manual">
						<ManualSkillForm control={form.control} categories={categories} />
					</TabsContent>

					<TabsContent value="ai">
						<AISkillForm
							categories={categories}
							setValue={form.setValue}
							onSelect={() => setActiveTab("manual")}
						/>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end space-x-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						キャンセル
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{defaultValues ? "更新" : "作成"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
