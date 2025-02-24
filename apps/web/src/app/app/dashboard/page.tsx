import type { Metadata } from "next";
import { ProjectSummary } from "./_components/project-summary";
import { MilestoneList } from "./_components/milestone-list";
import { MessageList } from "./_components/message-list";
import { DocumentList } from "./_components/document-list";
import {
	sampleMilestones,
	sampleMessages,
	sampleDocuments,
} from "../../../data/sample/dashboard";

export const metadata: Metadata = {
	title: "ダッシュボード",
	description: "プロジェクトの概要と進捗状況を確認できます。",
};

export default function DashboardPage() {
	// サンプルの次回ミーティング情報
	const nextMeeting = {
		date: "2024-02-01T15:00:00",
		title: "週次進捗ミーティング",
		description: "今週の進捗報告と次週の計画について",
	};

	// 未読メッセージ数のサンプル
	const unreadCount = sampleMessages.filter(
		(m) => m.readBy.length === 0,
	).length;

	return (
		<div className="container space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
				<p className="text-sm text-muted-foreground mt-1">
					プロジェクトの概要と進捗状況を確認できます。
				</p>
			</div>

			{/* プロジェクト概要 */}
			{/* <ProjectSummary project={sampleProject} /> */}

			{/* マイルストーン、メッセージ、ドキュメント */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [&>*]:h-full">
				<div className="flex">
					<MilestoneList milestones={sampleMilestones} />
				</div>
				<div className="flex">
					<MessageList
						messages={sampleMessages}
						nextMeeting={nextMeeting}
						unreadCount={unreadCount}
					/>
				</div>
				<div className="flex">
					<DocumentList documents={sampleDocuments} />
				</div>
			</div>
		</div>
	);
}
