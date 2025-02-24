"use client";
import Link from "next/link";
import { Card } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/format";
import type { Milestone } from "../../../../types/dashboard";

interface MilestoneListProps {
	milestones: Milestone[];
}

/**
 * マイルストーンリストコンポーネント
 */
export function MilestoneList({ milestones }: MilestoneListProps) {
	const getStatusColor = (status: Milestone["status"]) => {
		const colors = {
			not_started: "bg-gray-500",
			in_progress: "bg-blue-500",
			completed: "bg-green-500",
			delayed: "bg-red-500",
		};
		return colors[status];
	};

	const getStatusText = (status: Milestone["status"]) => {
		const texts = {
			not_started: "未着手",
			in_progress: "進行中",
			completed: "完了",
			delayed: "遅延",
		};
		return texts[status];
	};

	const displayMilestones = milestones.slice(0, 3);
	const hasMore = milestones.length > 3;

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold">マイルストーン</h3>
					<p className="text-sm text-muted-foreground mt-1">
						プロジェクトの重要なマイルストーンを確認できます
					</p>
				</div>
			</div>
			<div className="space-y-4">
				{displayMilestones.map((milestone) => (
					<div
						key={milestone.id}
						className="rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors"
					>
						<div className="flex items-start justify-between mb-2">
							<div>
								<h4 className="font-medium">{milestone.title}</h4>
								<p className="text-sm text-muted-foreground">
									{milestone.description}
								</p>
							</div>
							<Badge className={getStatusColor(milestone.status)}>
								{getStatusText(milestone.status)}
							</Badge>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">期限</span>
								<span>{formatDate(milestone.dueDate)}</span>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">進捗</span>
									<span>{milestone.progress}%</span>
								</div>
								<Progress value={milestone.progress} />
							</div>
						</div>
					</div>
				))}

				{hasMore && (
					<Button variant="outline" className="w-full" asChild>
						<Link href="/milestones">
							すべてのマイルストーンを確認
							<ChevronRight className="h-4 w-4 ml-2" />
						</Link>
					</Button>
				)}
			</div>
		</Card>
	);
}
