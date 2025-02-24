"use client";

import { useState, useCallback } from "react";
import { Button } from "../../../../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../../components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../../../components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { useToast } from "../../../../../hooks/use-toast";
import {
	getTasks,
	createTask,
	updateTask,
	deleteTask,
} from "../../../../../_actions/projects/tasks";
import { getMilestones } from "../../../../../_actions/projects/milestones";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useEffect } from "react";

interface TaskListProps {
	projectId: string;
}

interface Task {
	id: string;
	title: string;
	description: string | null;
	status: "todo" | "in_progress" | "done";
	priority: number | null;
	due_date: string | null;
	milestone_id: string | null;
	project_milestones: {
		id: string;
		title: string;
	} | null;
}

interface Milestone {
	id: string;
	title: string;
}

export function TaskList({ projectId }: TaskListProps) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [milestones, setMilestones] = useState<Milestone[]>([]);
	const [open, setOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const convertTask = useCallback(
		(task: {
			id: string;
			title: string;
			description: string | null;
			status: string;
			priority: number | null;
			due_date: string | null;
			project_milestones: Array<{ id: string; title: string }>;
		}): Task => {
			return {
				id: task.id,
				title: task.title,
				description: task.description,
				status: task.status as "todo" | "in_progress" | "done",
				priority: task.priority,
				due_date: task.due_date,
				milestone_id: task.project_milestones?.[0]?.id || null,
				project_milestones: task.project_milestones?.[0] || null,
			};
		},
		[],
	);

	useEffect(() => {
		async function fetchData() {
			const [tasksResult, milestonesResult] = await Promise.all([
				getTasks(projectId),
				getMilestones(projectId),
			]);

			if (tasksResult.data) {
				setTasks(tasksResult.data.map(convertTask));
			}
			if (milestonesResult.data) setMilestones(milestonesResult.data);
		}
		fetchData();
	}, [projectId, convertTask]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const milestoneId = formData.get("milestoneId") as string;
		const priority = formData.get("priority") as string;
		const dueDateStr = formData.get("dueDate") as string;
		const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

		if (editingTask) {
			const { error } = await updateTask(editingTask.id, {
				projectId,
				title,
				description,
				milestoneId: milestoneId || undefined,
				status: editingTask.status,
				priority: priority ? Number.parseInt(priority) : undefined,
				dueDate,
			});

			if (error) {
				toast({
					title: "エラー",
					description: "タスクの更新に失敗しました",
					variant: "destructive",
				});
			} else {
				toast({
					title: "成功",
					description: "タスクを更新しました",
				});
				setOpen(false);
				setEditingTask(null);
				const { data } = await getTasks(projectId);
				if (data) setTasks(data.map(convertTask));
			}
		} else {
			const { error } = await createTask({
				projectId,
				title,
				description,
				milestoneId: milestoneId || undefined,
				status: "todo",
				priority: priority ? Number.parseInt(priority) : undefined,
				dueDate,
			});

			if (error) {
				toast({
					title: "エラー",
					description: "タスクの作成に失敗しました",
					variant: "destructive",
				});
			} else {
				toast({
					title: "成功",
					description: "タスクを作成しました",
				});
				setOpen(false);
				const { data } = await getTasks(projectId);
				if (data) setTasks(data.map(convertTask));
			}
		}

		setLoading(false);
	}

	async function handleDelete(id: string) {
		const { error } = await deleteTask(id, projectId);

		if (error) {
			toast({
				title: "エラー",
				description: "タスクの削除に失敗しました",
				variant: "destructive",
			});
		} else {
			toast({
				title: "成功",
				description: "タスクを削除しました",
			});
			const { data } = await getTasks(projectId);
			if (data) setTasks(data.map(convertTask));
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">タスク</h2>
				<Dialog
					open={open}
					onOpenChange={(value) => {
						setOpen(value);
						if (!value) setEditingTask(null);
					}}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							タスクを作成
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editingTask ? "タスクを編集" : "タスクを作成"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">タイトル</Label>
								<Input
									id="title"
									name="title"
									placeholder="タスク名を入力"
									required
									defaultValue={editingTask?.title || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">説明</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="タスクの説明を入力"
									rows={3}
									defaultValue={editingTask?.description || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="milestoneId">マイルストーン</Label>
								<Select
									name="milestoneId"
									defaultValue={editingTask?.milestone_id || ""}
								>
									<SelectTrigger>
										<SelectValue placeholder="マイルストーンを選択" />
									</SelectTrigger>
									<SelectContent>
										{milestones.map((milestone) => (
											<SelectItem key={milestone.id} value={milestone.id}>
												{milestone.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="priority">優先度</Label>
								<Input
									type="number"
									id="priority"
									name="priority"
									placeholder="優先度を入力"
									min={0}
									max={100}
									defaultValue={editingTask?.priority || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dueDate">期限</Label>
								<Input
									type="date"
									id="dueDate"
									name="dueDate"
									defaultValue={
										editingTask?.due_date
											? new Date(editingTask.due_date)
													.toISOString()
													.split("T")[0]
											: ""
									}
								/>
							</div>
							<div className="flex justify-end">
								<Button type="submit" disabled={loading}>
									{editingTask ? "更新" : "作成"}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<div className="space-y-4">
				{tasks.map((task) => (
					<Card key={task.id}>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">{task.title}</CardTitle>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DialogTrigger asChild>
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault();
													setEditingTask(task);
													setOpen(true);
												}}
											>
												<Pencil className="h-4 w-4 mr-2" />
												編集
											</DropdownMenuItem>
										</DialogTrigger>
										<DropdownMenuItem
											className="text-destructive"
											onSelect={() => handleDelete(task.id)}
										>
											<Trash className="h-4 w-4 mr-2" />
											削除
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							{task.description && (
								<CardDescription>{task.description}</CardDescription>
							)}
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<div className="flex items-center gap-4">
									<div>ステータス: {task.status}</div>
									{task.priority !== null && <div>優先度: {task.priority}</div>}
								</div>
								<div className="flex items-center gap-4">
									{task.project_milestones && (
										<div>マイルストーン: {task.project_milestones.title}</div>
									)}
									{task.due_date && (
										<div>
											期限: {new Date(task.due_date).toLocaleDateString()}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
				{tasks.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							タスクがありません。新しいタスクを作成してください。
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
