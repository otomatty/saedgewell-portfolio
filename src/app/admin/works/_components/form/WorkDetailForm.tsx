"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Work } from "@/types/work";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateWorkDetail } from "@/_actions/works";

const workDetailFormSchema = z.object({
	overview: z
		.string()
		.min(1, "プロジェクト概要を入力してください")
		.max(1000, "プロジェクト概要は1000文字以内で入力してください"),
	role: z
		.string()
		.min(1, "担当役割を入力してください")
		.max(200, "担当役割は200文字以内で入力してください"),
	period: z
		.string()
		.min(1, "プロジェクト期間を入力してください")
		.max(100, "プロジェクト期間は100文字以内で入力してください"),
	team_size: z
		.string()
		.min(1, "チーム規模を入力してください")
		.max(100, "チーム規模は100文字以内で入力してください"),
});

type WorkDetailFormValues = z.infer<typeof workDetailFormSchema>;

interface WorkDetailFormProps {
	work: Work;
}

export function WorkDetailForm({ work }: WorkDetailFormProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<WorkDetailFormValues>({
		resolver: zodResolver(workDetailFormSchema),
		defaultValues: {
			overview: work.work_details[0]?.overview ?? "",
			role: work.work_details[0]?.role ?? "",
			period: work.work_details[0]?.period ?? "",
			team_size: work.work_details[0]?.team_size ?? "",
		},
	});

	const onSubmit = (values: WorkDetailFormValues) => {
		startTransition(async () => {
			try {
				await updateWorkDetail(work.id, values);
				toast({
					title: "更新完了",
					description: "詳細情報を更新しました。",
				});
				router.refresh();
			} catch (error) {
				toast({
					variant: "destructive",
					title: "エラー",
					description: "詳細情報の更新に失敗しました。",
				});
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="overview"
					render={({ field }) => (
						<FormItem>
							<FormLabel>プロジェクト概要</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormDescription>
								プロジェクトの概要を入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>担当役割</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								プロジェクトでの担当役割を入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="period"
					render={({ field }) => (
						<FormItem>
							<FormLabel>プロジェクト期間</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								プロジェクトの期間を入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="team_size"
					render={({ field }) => (
						<FormItem>
							<FormLabel>チーム規模</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								プロジェクトのチーム規模を入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit" disabled={isPending}>
						{isPending ? "更新中..." : "更新"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
