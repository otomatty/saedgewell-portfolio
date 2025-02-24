"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useToast } from "../../../../hooks/use-toast";
import { createProject } from "../../../../_actions/projects/projects";
import { Plus } from "lucide-react";
import { EmojiPicker } from "../../../../components/custom/EmojiPicker";

export function CreateProjectButton() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emoji, setEmoji] = useState("👋");
	const { toast } = useToast();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		const { error } = await createProject({ name, description, emoji });

		if (error) {
			toast({
				title: "エラー",
				description: "プロジェクトの作成に失敗しました",
				variant: "destructive",
			});
		} else {
			toast({
				title: "成功",
				description: "プロジェクトを作成しました",
			});
			setOpen(false);
		}

		setLoading(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					プロジェクトを作成
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>新規プロジェクト</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="emoji">絵文字</Label>
						<EmojiPicker value={emoji} onChange={setEmoji} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">プロジェクト名</Label>
						<Input
							id="name"
							name="name"
							placeholder="プロジェクト名を入力"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">説明</Label>
						<Textarea
							id="description"
							name="description"
							placeholder="プロジェクトの説明を入力"
							rows={3}
						/>
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={loading}>
							作成
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
