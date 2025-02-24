"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Work } from "../../../../types/work";
import { Button } from "../../../../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DeleteWorkDialog } from "./DeleteWorkDialog";

type WorkStatus = Work["status"];
type WorkCategory = Work["category"];

const statusMap: Record<
	WorkStatus,
	{ label: string; variant: "secondary" | "default" | "destructive" }
> = {
	draft: { label: "下書き", variant: "secondary" },
	published: { label: "公開済み", variant: "default" },
	archived: { label: "アーカイブ", variant: "destructive" },
} as const;

const categoryMap: Record<WorkCategory, { label: string; variant: "default" }> =
	{
		company: { label: "企業案件", variant: "default" },
		freelance: { label: "フリーランス案件", variant: "default" },
		personal: { label: "個人開発", variant: "default" },
	} as const;

interface WorksTableProps {
	works: Work[];
}

export function WorksTable({ works }: WorksTableProps) {
	const [selectedWork, setSelectedWork] = useState<Work | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
	const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

	const handleDelete = (work: Work) => {
		setSelectedWork(work);
		setIsDeleteDialogOpen(true);
	};

	const handleBulkDelete = () => {
		setIsBulkDeleteDialogOpen(true);
	};

	const toggleAll = (checked: boolean) => {
		setSelectedWorkIds(checked ? works.map((work) => work.id) : []);
	};

	const toggleWork = (workId: string, checked: boolean) => {
		setSelectedWorkIds((prev) =>
			checked ? [...prev, workId] : prev.filter((id) => id !== workId),
		);
	};

	return (
		<>
			<div className="space-y-4">
				{selectedWorkIds.length > 0 && (
					<div className="flex items-center gap-2">
						<Button variant="destructive" size="sm" onClick={handleBulkDelete}>
							選択した{selectedWorkIds.length}件を削除
						</Button>
					</div>
				)}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-12">
									<Checkbox
										checked={
											works.length > 0 &&
											selectedWorkIds.length === works.length
										}
										onCheckedChange={toggleAll}
										aria-label="全て選択"
									/>
								</TableHead>
								<TableHead>タイトル</TableHead>
								<TableHead>カテゴリー</TableHead>
								<TableHead>ステータス</TableHead>
								<TableHead>作成日時</TableHead>
								<TableHead>更新日時</TableHead>
								<TableHead className="w-12" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{works.map((work) => (
								<TableRow key={work.id}>
									<TableCell>
										<Checkbox
											checked={selectedWorkIds.includes(work.id)}
											onCheckedChange={(checked) =>
												toggleWork(work.id, checked as boolean)
											}
											aria-label={`${work.title}を選択`}
										/>
									</TableCell>
									<TableCell>
										<Link
											href={`/admin/works/${work.id}`}
											className="hover:underline"
										>
											{work.title}
										</Link>
									</TableCell>
									<TableCell>
										<Badge variant={categoryMap[work.category].variant}>
											{categoryMap[work.category].label}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={statusMap[work.status].variant}>
											{statusMap[work.status].label}
										</Badge>
									</TableCell>
									<TableCell>
										{work.created_at
											? format(new Date(work.created_at), "yyyy/MM/dd HH:mm", {
													locale: ja,
												})
											: "-"}
									</TableCell>
									<TableCell>
										{work.updated_at
											? format(new Date(work.updated_at), "yyyy/MM/dd HH:mm", {
													locale: ja,
												})
											: "-"}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">メニューを開く</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link
														href={`/admin/works/${work.id}`}
														className="flex items-center"
													>
														<Pencil className="mr-2 h-4 w-4" />
														編集
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onClick={() => handleDelete(work)}
												>
													<Trash2 className="mr-2 h-4 w-4" />
													削除
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			{selectedWork && (
				<DeleteWorkDialog
					workId={selectedWork.id}
					workTitle={selectedWork.title}
					isOpen={isDeleteDialogOpen}
					onClose={() => {
						setIsDeleteDialogOpen(false);
						setSelectedWork(null);
					}}
				/>
			)}

			<DeleteWorkDialog
				workIds={selectedWorkIds}
				isOpen={isBulkDeleteDialogOpen}
				onClose={() => {
					setIsBulkDeleteDialogOpen(false);
					setSelectedWorkIds([]);
				}}
			/>
		</>
	);
}
