"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/responsive-dialog";
import { ContactChat, type Category } from "./contact-chat";
import { MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ContactDialogProps {
	/**
	 * カテゴリーのリスト
	 */
	categories: Category[];
	/**
	 * メッセージ送信時のコールバック
	 */
	onSendMessage: (
		message: string,
		files: File[],
		category: Category,
	) => Promise<void>;
	/**
	 * トリガーボタンのテキスト
	 */
	triggerText?: string;
	/**
	 * トリガーボタンのクラス名
	 */
	triggerClassName?: string;
}

/**
 * お問い合わせチャットをダイアログ/ドロワーで表示するコンポーネント
 * - デスクトップではダイアログ
 * - モバイルではドロワー
 */
export const ContactDialog = ({
	categories = [],
	onSendMessage,
	triggerText = "お問い合わせ",
	triggerClassName,
}: ContactDialogProps) => {
	if (!Array.isArray(categories)) {
		console.error("categories must be an array");
		return null;
	}

	return (
		<ResponsiveDialog
			trigger={
				<Button variant="outline" className={triggerClassName}>
					<MessageCircle className="mr-2 h-4 w-4" />
					{triggerText}
				</Button>
			}
			title="お問い合わせ"
			description="お困りの内容をお聞かせください"
			contentClassName="sm:max-w-[600px] h-[80vh]"
		>
			{({ close }) => (
				<>
					{categories.length === 0 ? (
						<Alert variant="destructive">
							<AlertDescription>
								申し訳ありません。現在お問い合わせカテゴリーが設定されていません。
							</AlertDescription>
						</Alert>
					) : (
						<ContactChat
							categories={categories}
							onSendMessage={async (...args) => {
								await onSendMessage(...args);
								// TODO: メッセージ送信完了時にダイアログを閉じるかどうかを検討
								// close();
							}}
							className="h-full"
						/>
					)}
				</>
			)}
		</ResponsiveDialog>
	);
};
