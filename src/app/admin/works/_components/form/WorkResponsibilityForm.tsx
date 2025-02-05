"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateWorkResponsibilities } from "@/app/_actions/works";
import { Plus, Trash2 } from "lucide-react";

const workResponsibilitySchema = z.object({
	description: z
		.string()
		.min(1, "担当業務を入力してください")
		.max(500, "担当業務は500文字以内で入力してください"),
});

const workResponsibilityFormSchema = z.object({
	responsibilities: z.array(workResponsibilitySchema),
});

type WorkResponsibilityFormValues = z.infer<
	typeof workResponsibilityFormSchema
>;

interface WorkResponsibilityFormProps {
	work: Work;
}

export function WorkResponsibilityForm({ work }: WorkResponsibilityFormProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<WorkResponsibilityFormValues>({
		resolver: zodResolver(workResponsibilityFormSchema),
		defaultValues: {
			responsibilities: work.work_responsibilities.map((responsibility) => ({
				description: responsibility.description,
			})),
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "responsibilities",
	});

	const onSubmit = (values: WorkResponsibilityFormValues) => {
		startTransition(async () => {
			try {
				await updateWorkResponsibilities(work.id, values.responsibilities);
				toast({
					title: "更新完了",
					description: "担当業務を更新しました。",
				});
				router.refresh();
			} catch (error) {
				toast({
					variant: "destructive",
					title: "エラー",
					description: "担当業務の更新に失敗しました。",
				});
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-4">
					{fields.map((field, index) => (
						<div key={field.id} className="flex items-start gap-2">
							<FormField
								control={form.control}
								name={`responsibilities.${index}.description`}
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel className={index !== 0 ? "sr-only" : undefined}>
											担当業務
										</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="self-end"
								onClick={() => remove(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>

				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() => append({ description: "" })}
				>
					<Plus className="mr-2 h-4 w-4" />
					担当業務を追加
				</Button>

				<div className="flex justify-end">
					<Button type="submit" disabled={isPending}>
						{isPending ? "更新中..." : "更新"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
