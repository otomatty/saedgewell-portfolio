import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import type { Project } from "@/types/project";

interface ProjectBasicInfoProps {
	project: Project;
}

/**
 * プロジェクト基本情報コンポーネント
 * @param props - プロジェクト情報
 */
export function ProjectBasicInfo({ project }: ProjectBasicInfoProps) {
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
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">{project.name}</h2>
				<Badge className={getStatusColor(project.status)}>
					{getStatusText(project.status)}
				</Badge>
			</div>
			<p className="text-muted-foreground">{project.description}</p>
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
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium">進捗状況</span>
					<span className="text-sm text-muted-foreground">
						{project.progress}%
					</span>
				</div>
				<Progress value={project.progress} />
			</div>
		</div>
	);
}
