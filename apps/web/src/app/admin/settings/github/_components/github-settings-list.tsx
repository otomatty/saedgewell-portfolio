"use client";

import { useEffect, useState, useCallback } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../../../components/ui/table";
import {
	getGitHubSettings,
	syncGitHubContributions,
} from "../../../../../_actions/github";
import { useToast } from "../../../../../hooks/use-toast";
import { Badge } from "../../../../../components/ui/badge";
import { formatDate } from "@/utils/format";
import type { GitHubSettings } from "../../../../../types/github";
import { snakeToCamel } from "../../../../../utils/case-converter";
import { Button } from "../../../../../components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface GitHubSettingsListProps {
	onRefresh?: () => void;
}

export function GitHubSettingsList({ onRefresh }: GitHubSettingsListProps) {
	const [settings, setSettings] = useState<GitHubSettings[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSyncing, setIsSyncing] = useState(false);
	const { toast } = useToast();

	const fetchSettings = useCallback(async () => {
		try {
			const result = await getGitHubSettings();
			if (!result.success) {
				throw result.error;
			}
			setSettings(
				result.data?.map((setting) => ({
					...(snakeToCamel(setting) as Omit<
						GitHubSettings,
						"lastSyncedAt" | "createdAt" | "updatedAt"
					>),
					lastSyncedAt: setting.last_synced_at
						? new Date(setting.last_synced_at)
						: null,
					createdAt: new Date(setting.created_at ?? ""),
					updatedAt: new Date(setting.updated_at ?? ""),
				})) ?? [],
			);
		} catch (error) {
			console.error("設定の取得に失敗しました:", error);
			toast({
				title: "エラー",
				description: "設定の取得に失敗しました。",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	const handleSync = async (settingId: string) => {
		try {
			setIsSyncing(true);
			const result = await syncGitHubContributions();
			if (!result.success) {
				throw result.error;
			}
			toast({
				title: "同期完了",
				description: "GitHubの貢献データを同期しました。",
			});
			await fetchSettings();
		} catch (error) {
			console.error("同期に失敗しました:", error);
			toast({
				title: "エラー",
				description: "同期に失敗しました。",
				variant: "destructive",
			});
		} finally {
			setIsSyncing(false);
		}
	};

	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	if (isLoading) {
		return <div>読み込み中...</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">登録済みの設定</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ユーザー名</TableHead>
						<TableHead>自動同期</TableHead>
						<TableHead>最終同期日時</TableHead>
						<TableHead>更新日時</TableHead>
						<TableHead>アクション</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{settings.map((setting) => (
						<TableRow key={setting.id}>
							<TableCell>{setting.username}</TableCell>
							<TableCell>
								<Badge variant={setting.autoSync ? "default" : "secondary"}>
									{setting.autoSync ? "有効" : "無効"}
								</Badge>
							</TableCell>
							<TableCell>
								{setting.lastSyncedAt
									? formatDate(setting.lastSyncedAt.toISOString())
									: "未同期"}
							</TableCell>
							<TableCell>
								{formatDate(setting.updatedAt.toISOString())}
							</TableCell>
							<TableCell>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleSync(setting.id)}
									disabled={isSyncing}
								>
									{isSyncing ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											同期中...
										</>
									) : (
										<>
											<RefreshCw className="mr-2 h-4 w-4" />
											手動同期
										</>
									)}
								</Button>
							</TableCell>
						</TableRow>
					))}
					{settings.length === 0 && (
						<TableRow>
							<TableCell colSpan={5} className="text-center">
								設定が登録されていません
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
