import { formatNumber } from "@/utils/number";
import type { Project } from "@/types/project";

interface ProjectKPIProps {
	project: Project;
}

/**
 * プロジェクトKPIコンポーネント
 * @param props - プロジェクト情報
 */
export function ProjectKPI({ project }: ProjectKPIProps) {
	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">プロジェクトKPI</h3>
				<p className="text-sm text-muted-foreground mt-1">
					プロジェクトの主要な指標を確認できます
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* 稼働時間 */}
				<div className="rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors">
					<p className="text-sm font-medium">稼働時間</p>
					<div className="mt-3 space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">計画</span>
							<span className="font-medium">
								{formatNumber(project.workHours.planned)}h
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">実績</span>
							<span className="font-medium">
								{formatNumber(project.workHours.actual)}h
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">残り</span>
							<span className="font-medium">
								{formatNumber(project.workHours.remaining)}h
							</span>
						</div>
					</div>
				</div>

				{/* 予算 */}
				<div className="rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors">
					<p className="text-sm font-medium">予算状況</p>
					<div className="mt-3 space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">総額</span>
							<span className="font-medium">
								¥{formatNumber(project.budget.total)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">使用額</span>
							<span className="font-medium">
								¥{formatNumber(project.budget.used)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">残額</span>
							<span className="font-medium">
								¥{formatNumber(project.budget.remaining)}
							</span>
						</div>
					</div>
				</div>

				{/* メトリクス */}
				<div className="rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors">
					<p className="text-sm font-medium">パフォーマンス指標</p>
					<div className="mt-3 space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								タスク完了率
							</span>
							<span className="font-medium">
								{project.metrics.taskCompletion}%
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								リソース稼働率
							</span>
							<span className="font-medium">
								{project.metrics.resourceUtilization}%
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								スケジュール遵守率
							</span>
							<span className="font-medium">
								{project.metrics.scheduleVariance}%
							</span>
						</div>
					</div>
				</div>

				{/* 品質指標 */}
				<div className="rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors">
					<p className="text-sm font-medium">品質指標</p>
					<div className="mt-3 space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">バグ発生率</span>
							<span className="font-medium">
								{project.metrics.quality.bugRate}%
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								テストカバレッジ
							</span>
							<span className="font-medium">
								{project.metrics.quality.testCoverage}%
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">
								コードレビュー率
							</span>
							<span className="font-medium">
								{project.metrics.quality.codeReviewRate}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
