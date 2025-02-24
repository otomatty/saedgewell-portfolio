"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Work } from "../../../../../types/work";
import { Button } from "../../../../../components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../../components/ui/select";
import { useToast } from "../../../../../hooks/use-toast";
import { updateWork } from "../../../../../_actions/works";

const workBasicFormSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルを入力してください")
		.max(100, "タイトルは100文字以内で入力してください"),
	slug: z
		.string()
		.min(1, "スラッグを入力してください")
		.max(100, "スラッグは100文字以内で入力してください")
		.regex(/^[a-z0-9-]+$/, "スラッグは半角英数字とハイフンのみ使用できます"),
	description: z
		.string()
		.min(1, "説明を入力してください")
		.max(500, "説明は500文字以内で入力してください"),
	thumbnail_url: z
		.string()
		.url("サムネイルURLを入力してください")
		.or(z.literal(""))
		.optional(),
	github_url: z
		.string()
		.url("GitHubのURLを入力してください")
		.or(z.literal(""))
		.optional(),
	website_url: z
		.string()
		.url("WebサイトのURLを入力してください")
		.or(z.literal(""))
		.optional(),
	category: z.enum(["company", "freelance", "personal"]),
	status: z.enum(["draft", "published", "archived"]),
});

type WorkBasicFormValues = z.infer<typeof workBasicFormSchema>;

interface WorkBasicFormProps {
	work: Work;
}

export function WorkBasicForm({ work }: WorkBasicFormProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<WorkBasicFormValues>({
		resolver: zodResolver(workBasicFormSchema),
		defaultValues: {
			title: work.title,
			slug: work.slug,
			description: work.description,
			thumbnail_url: work.thumbnail_url ?? "",
			github_url: work.github_url ?? "",
			website_url: work.website_url ?? "",
			category: work.category,
			status: work.status,
		},
	});

	const onSubmit = (values: WorkBasicFormValues) => {
		startTransition(async () => {
			try {
				await updateWork(work.id, {
					...values,
					thumbnail_url: values.thumbnail_url ?? undefined,
					github_url: values.github_url ?? undefined,
					website_url: values.website_url ?? undefined,
				});
				toast({
					title: "更新完了",
					description: "基本情報を更新しました。",
				});
				router.refresh();
			} catch (error) {
				toast({
					variant: "destructive",
					title: "エラー",
					description: "基本情報の更新に失敗しました。",
				});
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>タイトル</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								実績のタイトルを入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>スラッグ</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								URLに使用される識別子です。半角英数字とハイフンのみ使用できます。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>説明</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormDescription>実績の説明を入力してください。</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="thumbnail_url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>サムネイルURL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								サムネイル画像のURLを入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="github_url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>GitHub URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								GitHubのリポジトリURLを入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="website_url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Webサイト URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								WebサイトのURLを入力してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>カテゴリー</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="カテゴリーを選択" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="company">企業案件</SelectItem>
									<SelectItem value="freelance">フリーランス案件</SelectItem>
									<SelectItem value="personal">個人開発</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								実績のカテゴリーを選択してください。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ステータス</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="ステータスを選択" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="draft">下書き</SelectItem>
									<SelectItem value="published">公開済み</SelectItem>
									<SelectItem value="archived">アーカイブ</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								実績の公開状態を選択してください。
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
