"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { getProjectSyncLogs } from "@/app/_actions/knowledge";
import { syncProject } from "@/app/_actions/knowledge-sync";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { RefreshCcw } from "lucide-react";

type SyncLog = Database["public"]["Tables"]["knowledge_sync_logs"]["Row"];

interface ProjectSyncProps {
	projectId: string;
}

export function ProjectSync({ projectId }: ProjectSyncProps) {
	const [isSyncing, setIsSyncing] = useState(false);
	const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
	const { toast } = useToast();

	const fetchSyncLogs = useCallback(async () => {
		try {
			const logs = await getProjectSyncLogs(projectId);
			setSyncLogs(logs);
		} catch (error) {
			console.error("Failed to fetch sync logs:", error);
			toast({
				title: "同期ログの取得に失敗しました",
				description:
					error instanceof Error
						? error.message
						: "不明なエラーが発生しました。",
				variant: "destructive",
			});
		}
	}, [projectId, toast]);

	useEffect(() => {
		fetchSyncLogs();
	}, [fetchSyncLogs]);

	const handleSync = async () => {
		setIsSyncing(true);
		try {
			const result = await syncProject(projectId);
			if (result.success) {
				toast({
					title: "同期が完了しました",
					description: "プロジェクトの同期が正常に完了しました。",
				});
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error("Failed to sync project:", error);
			toast({
				title: "同期に失敗しました",
				description:
					error instanceof Error
						? error.message
						: "不明なエラーが発生しました。",
				variant: "destructive",
			});
		} finally {
			setIsSyncing(false);
			fetchSyncLogs();
		}
	};

	const columns: ColumnDef<SyncLog>[] = [
		{
			accessorKey: "sync_started_at",
			header: "開始日時",
			cell: ({ row }) =>
				format(new Date(row.original.sync_started_at), "yyyy/MM/dd HH:mm:ss", {
					locale: ja,
				}),
		},
		{
			accessorKey: "sync_completed_at",
			header: "完了日時",
			cell: ({ row }) =>
				row.original.sync_completed_at
					? format(
							new Date(row.original.sync_completed_at),
							"yyyy/MM/dd HH:mm:ss",
							{ locale: ja },
						)
					: "-",
		},
		{
			accessorKey: "status",
			header: "ステータス",
			cell: ({ row }) => {
				const status = row.original.status;
				switch (status) {
					case "completed":
						return "完了";
					case "processing":
						return "処理中";
					case "error":
						return "エラー";
					default:
						return status;
				}
			},
		},
		{
			accessorKey: "pages_processed",
			header: "処理ページ数",
		},
		{
			accessorKey: "pages_updated",
			header: "更新ページ数",
		},
	];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>手動同期</CardTitle>
				</CardHeader>
				<CardContent>
					<Button onClick={handleSync} disabled={isSyncing} className="w-full">
						<RefreshCcw
							className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
						/>
						{isSyncing ? "同期中..." : "今すぐ同期"}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>同期ログ</CardTitle>
				</CardHeader>
				<CardContent>
					{syncLogs ? (
						<DataTable columns={columns} data={syncLogs} />
					) : (
						<Skeleton className="h-[400px]" />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
