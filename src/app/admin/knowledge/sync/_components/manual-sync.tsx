"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
	checkProjectExists,
	registerProject,
} from "@/app/_actions/knowledge-sync";

export function ManualSync() {
	const [projectName, setProjectName] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [projectInfo, setProjectInfo] = useState<{
		exists: boolean;
		count?: number;
		error?: string;
	} | null>(null);
	const { toast } = useToast();

	const handleCheck = async () => {
		if (!projectName.trim()) {
			toast({
				title: "エラー",
				description: "プロジェクト名を入力してください。",
				variant: "destructive",
			});
			return;
		}

		setIsChecking(true);
		try {
			const result = await checkProjectExists(projectName);
			setProjectInfo(result);
			if (!result.exists) {
				toast({
					title: "エラー",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "プロジェクトの確認中にエラーが発生しました。",
				variant: "destructive",
			});
		} finally {
			setIsChecking(false);
		}
	};

	const handleRegister = async () => {
		if (!projectInfo?.exists || !projectInfo.count) return;

		setIsRegistering(true);
		try {
			const result = await registerProject(projectName, projectInfo.count);
			if (result.success) {
				toast({
					title: "成功",
					description: "プロジェクトを登録しました。",
				});
				setProjectName("");
				setProjectInfo(null);
			} else {
				toast({
					title: "エラー",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "プロジェクトの登録に失敗しました。",
				variant: "destructive",
			});
		} finally {
			setIsRegistering(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<Input
					placeholder="プロジェクト名を入力"
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
					disabled={isChecking || isRegistering}
				/>
				<Button
					onClick={handleCheck}
					disabled={isChecking || isRegistering || !projectName.trim()}
				>
					{isChecking ? "確認中..." : "確認"}
				</Button>
			</div>

			{projectInfo?.exists && (
				<Alert>
					<AlertDescription>
						プロジェクト「{projectName}」が見つかりました。
						<br />
						総ページ数: {projectInfo.count}
						<div className="mt-2">
							<Button onClick={handleRegister} disabled={isRegistering}>
								{isRegistering ? "登録中..." : "プロジェクトとして登録"}
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
