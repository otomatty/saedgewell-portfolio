"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FormData } from "./ContactForm";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	formData: FormData;
};

export default function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	formData,
}: Props) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>入力内容の確認</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<p className="text-sm font-medium mb-1">お名前</p>
						<p className="text-sm text-muted-foreground">{formData.name}</p>
					</div>
					<div>
						<p className="text-sm font-medium mb-1">メールアドレス</p>
						<p className="text-sm text-muted-foreground">{formData.email}</p>
					</div>
					<div>
						<p className="text-sm font-medium mb-1">メッセージ</p>
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">
							{formData.message}
						</p>
					</div>
				</div>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onClose}>
						修正する
					</Button>
					<Button onClick={onConfirm}>送信する</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
