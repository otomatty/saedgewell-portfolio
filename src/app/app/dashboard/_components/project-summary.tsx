import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/number";
import type { Project } from "@/types/project";

interface ProjectSummaryProps {
	project: Project;
}

/**
 * ダッシュボード用プロジェクト概要コンポーネント
 */
export function ProjectSummary({ project }: ProjectSummaryProps) {
	const getStatusColor = (status: Project["status"]) => {
		const colors = {
			not_started: "bg-gray-500",
			in_progress: "bg-blue-500",
			on_hold: "bg-yellow-500",
			completed: "bg-green-500",
		};
		return colors[status];
	};

	const getStatusText = (status: Project["status"]) => {
		const texts = {
			not_started: "未着手",
			in_progress: "進行中",
			on_hold: "一時停止",
			completed: "完了",
		};
		return texts[status];
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold">プロジェクト概要</h3>
					<p className="text-sm text-muted-foreground mt-1">
						現在進行中のプロジェクトの状況を確認できます
					</p>
				</div>
				<Badge className={getStatusColor(project.status)}>
					{getStatusText(project.status)}
				</Badge>
			</div>

			<div className="space-y-6">
				<div>
					<h4 className="text-xl font-semibold">{project.name}</h4>
					<p className="text-sm text-muted-foreground mt-1">
						{project.description}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">開始日</p>
						<p className="font-medium">{formatDate(project.startDate)}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">終了予定日</p>
						<p className="font-medium">{formatDate(project.endDate)}</p>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">進捗状況</span>
						<span className="text-sm font-medium">{project.progress}%</span>
					</div>
					<Progress value={project.progress} />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">予算消化率</p>
						<p className="font-medium">
							{Math.round((project.budget.used / project.budget.total) * 100)}%
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							¥{formatNumber(project.budget.used)} / ¥
							{formatNumber(project.budget.total)}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">稼働時間消化率</p>
						<p className="font-medium">
							{Math.round(
								(project.workHours.actual / project.workHours.planned) * 100,
							)}
							%
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{formatNumber(project.workHours.actual)}h /{" "}
							{formatNumber(project.workHours.planned)}h
						</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
