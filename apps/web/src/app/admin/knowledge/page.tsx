import { Suspense } from "react";
import { ProjectsOverview } from "./_components/projects-overview";
import { RecentPages } from "./_components/recent-pages";
import { PageStats } from "./_components/page-stats";
import { getProjects, getRecentPages } from "../../../_actions/knowledge";

export default async function KnowledgePage() {
	const [projects, recentPages] = await Promise.all([
		getProjects(),
		getRecentPages(5),
	]);

	return (
		<div className="container mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold">ナレッジ管理</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Suspense fallback={<div>Loading projects...</div>}>
					<ProjectsOverview projects={projects} />
				</Suspense>

				<Suspense fallback={<div>Loading stats...</div>}>
					<PageStats projects={projects} />
				</Suspense>
			</div>

			<Suspense fallback={<div>Loading recent pages...</div>}>
				<RecentPages pages={recentPages} />
			</Suspense>
		</div>
	);
}

export const metadata = {
	title: "ナレッジベース管理",
	description: "Scrapboxと連携したナレッジベースを管理します。",
};
