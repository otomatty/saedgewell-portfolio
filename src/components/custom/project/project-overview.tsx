import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectBasicInfo } from "./project-basic-info";
import { ProjectKPI } from "./project-kpi";
import { ProjectMetricsChart } from "./project-metrics-chart";
import { Separator } from "@/components/ui/separator";
import type { Project, ProjectMetrics } from "@/types/project";

interface ProjectOverviewProps {
	project: Project;
	metrics: ProjectMetrics;
}

/**
 * プロジェクト概要コンポーネント
 * @param props - プロジェクトと指標データ
 */
export function ProjectOverview({ project, metrics }: ProjectOverviewProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						現在のプロジェクト
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						プロジェクトの進捗状況と重要な指標を確認できます
					</p>
				</div>
			</div>

			<Card className="w-full">
				<div className="grid grid-cols-12 divide-x divide-border">
					{/* 基本情報セクション - 左側4列 */}
					<div className="col-span-12 lg:col-span-4 p-6">
						<ProjectBasicInfo project={project} />
					</div>

					{/* KPIセクション - 右側8列 */}
					<div className="col-span-12 lg:col-span-8 p-6">
						<ProjectKPI project={project} />
					</div>
				</div>

				<Separator className="my-2" />

				{/* データ可視化セクション - 下部全幅 */}
				<div className="p-6 pt-4">
					<div className="mb-4">
						<h3 className="text-lg font-semibold">プロジェクトメトリクス</h3>
						<p className="text-sm text-muted-foreground mt-1">
							稼働時間とタスク完了率の推移を確認できます
						</p>
					</div>
					<Tabs defaultValue="daily" className="w-full">
						<TabsList className="mb-4">
							<TabsTrigger value="daily">日次</TabsTrigger>
							<TabsTrigger value="weekly">週次</TabsTrigger>
						</TabsList>
						<TabsContent value="daily">
							<div className="rounded-lg border bg-card/50 p-4">
								<ProjectMetricsChart data={metrics.daily} />
							</div>
						</TabsContent>
						<TabsContent value="weekly">
							<div className="rounded-lg border bg-card/50 p-4">
								<ProjectMetricsChart data={metrics.weekly} />
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</Card>
		</div>
	);
}
