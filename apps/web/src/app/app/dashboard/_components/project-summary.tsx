import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import type { Project } from "../../../../types/project";

interface ProjectSummaryProps {
	project: Project;
}

/**
 * プロジェクト概要を表示するコンポーネント
 * @param project プロジェクト情報
 */
export function ProjectSummary({ project }: ProjectSummaryProps) {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold">プロジェクト概要</h3>
					<p className="text-sm text-muted-foreground mt-1">
						プロジェクトの基本情報を確認できます
					</p>
				</div>
				<Badge variant={project.isArchived ? "secondary" : "default"}>
					{project.isArchived ? "アーカイブ済み" : "アクティブ"}
				</Badge>
			</div>

			<div className="space-y-6">
				<div className="flex items-start gap-2">
					{project.emoji && (
						<span className="text-2xl" role="img" aria-label="Project emoji">
							{project.emoji}
						</span>
					)}
					<div>
						<h4 className="text-xl font-semibold">{project.name}</h4>
						{project.description && (
							<p className="text-sm text-muted-foreground mt-1">
								{project.description}
							</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">作成日</p>
						<p className="font-medium">
							{formatDate(project.createdAt.toISOString())}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">最終更新日</p>
						<p className="font-medium">
							{formatDate(project.updatedAt.toISOString())}
						</p>
					</div>
				</div>

				<div>
					<p className="text-sm text-muted-foreground">最終アクティビティ</p>
					<p className="font-medium">
						{formatDate(project.lastActivityAt.toISOString())}
					</p>
				</div>
			</div>
		</Card>
	);
}
