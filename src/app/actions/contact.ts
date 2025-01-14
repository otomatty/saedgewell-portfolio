"use server";

import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(1, "名前を入力してください"),
	email: z.string().email("有効なメールアドレスを入力してください"),
	message: z.string().min(10, "メッセージは10文字以上で入力してください"),
	recaptchaToken: z.string(),
});

export type ContactFormData = z.infer<typeof formSchema>;

export async function sendContactEmail(formData: z.infer<typeof formSchema>) {
	const result = formSchema.safeParse(formData);
	if (!result.success) {
		return { error: "入力内容が正しくありません" };
	}

	try {
		// TODO: 実際のメール送信処理を実装
		// 例: SendGrid, AWS SES, Resend などのサービスを使用

		// 送信の遅延をシミュレート
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return { success: true };
	} catch (error) {
		console.error("メール送信エラー:", error);
		return { error: "メールの送信に失敗しました" };
	}
}
