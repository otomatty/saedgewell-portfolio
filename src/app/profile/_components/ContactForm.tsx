"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/app/actions/contact";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ConfirmDialog from "./ConfirmDialog";

const formSchema = z.object({
	name: z.string().min(1, "名前を入力してください"),
	email: z.string().email("有効なメールアドレスを入力してください"),
	message: z.string().min(10, "メッセージは10文字以上で入力してください"),
});

export type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [formValues, setFormValues] = useState<FormData | null>(null);
	const { executeRecaptcha } = useGoogleReCaptcha() ?? {};
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	async function handleSubmit(values: FormData) {
		if (!executeRecaptcha) {
			toast({
				title: "reCAPTCHAの読み込みに失敗しました",
				variant: "destructive",
			});
			return;
		}

		setFormValues(values);
		setShowConfirm(true);
	}

	async function handleConfirm() {
		if (!formValues || !executeRecaptcha) return;

		setIsSubmitting(true);
		try {
			const token = await executeRecaptcha("contact_form");
			const result = await sendContactEmail({
				...formValues,
				recaptchaToken: token,
			});

			if (result.error) {
				toast({
					title: "メッセージの送信に失敗しました",
					description: result.error,
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "メッセージを送信しました",
			});
			form.reset();
			setShowConfirm(false);
		} catch (error) {
			toast({
				title: "送信に失敗しました。もう一度お試しください。",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>お問い合わせ</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>お名前</FormLabel>
										<FormControl>
											<Input placeholder="山田 太郎" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>メールアドレス</FormLabel>
										<FormControl>
											<Input placeholder="taro@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>メッセージ</FormLabel>
										<FormControl>
											<Textarea
												placeholder="お問い合わせ内容を入力してください"
												className="min-h-[120px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{isSubmitting ? "送信中..." : "送信"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			{formValues && (
				<ConfirmDialog
					isOpen={showConfirm}
					onClose={() => setShowConfirm(false)}
					onConfirm={handleConfirm}
					formData={formValues}
				/>
			)}
		</>
	);
}
