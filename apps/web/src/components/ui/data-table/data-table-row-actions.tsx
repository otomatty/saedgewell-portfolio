"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../dropdown-menu";
import { useToast } from "../../../hooks/use-toast";
import type { DataTableRowActionsProps } from "../../../types/data-table";
import { DataTableDeleteDialog } from "./data-table-delete-dialog";
import { DataTableEditDialog } from "./data-table-edit-dialog";

/**
 * データテーブルの行アクションコンポーネント
 *
 * @description
 * このコンポーネントは各行に対する操作メニューを提供します：
 * - 編集アクション（設定されている場合）：編集フォームをダイアログで表示
 * - 削除アクション（設定されている場合）：削除確認ダイアログを表示
 *
 * メニューはドロップダウン形式で表示され、モバイル対応のUIを提供します。
 * エラーハンドリングとローディング状態の管理も行います。
 *
 * @example
 * ```tsx
 * <DataTableRowActions
 *   row={row}
 *   onEdit={async (row) => {
 *     // 編集処理
 *   }}
 *   onDelete={async (row) => {
 *     // 削除処理
 *   }}
 *   editForm={<EditForm row={row} onSubmit={handleSubmit} />}
 *   editTitle="アイテムの編集"
 * />
 * ```
 */
export function DataTableRowActions<TData>({
	row,
	onEdit,
	onDelete,
	editForm,
	editTitle,
}: DataTableRowActionsProps<TData>) {
	const { toast } = useToast();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async (row: TData) => {
		try {
			setIsLoading(true);
			await onDelete?.(row);
			toast({
				title: "削除しました",
				description: "アイテムは正常に削除されました。",
			});
			setShowDeleteDialog(false);
		} catch (error) {
			console.error("Delete failed:", error);
			toast({
				title: "エラー",
				description:
					error instanceof Error ? error.message : "削除に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = async (row: TData) => {
		try {
			setIsLoading(true);
			await onEdit?.(row);
			toast({
				title: "更新しました",
				description: "アイテムは正常に更新されました。",
			});
			setShowEditDialog(false);
		} catch (error) {
			console.error("Edit failed:", error);
			toast({
				title: "エラー",
				description:
					error instanceof Error ? error.message : "更新に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
						disabled={isLoading}
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">メニューを開く</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					{onEdit && editForm && (
						<DropdownMenuItem
							onClick={() => setShowEditDialog(true)}
							disabled={isLoading}
						>
							編集
						</DropdownMenuItem>
					)}
					{onEdit && onDelete && <DropdownMenuSeparator />}
					{onDelete && (
						<DropdownMenuItem
							onClick={() => setShowDeleteDialog(true)}
							className="text-destructive focus:text-destructive"
							disabled={isLoading}
						>
							削除
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{onDelete && (
				<DataTableDeleteDialog
					open={showDeleteDialog}
					onOpenChange={setShowDeleteDialog}
					onDelete={handleDelete}
					row={row}
				/>
			)}

			{onEdit && editForm && (
				<DataTableEditDialog
					open={showEditDialog}
					onOpenChange={setShowEditDialog}
					onEdit={handleEdit}
					row={row}
					title={editTitle}
				>
					{editForm}
				</DataTableEditDialog>
			)}
		</>
	);
}
