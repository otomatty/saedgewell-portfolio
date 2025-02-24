import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PageHeader } from "@/components/custom/page-header";
import { ProjectHeader } from "./_components/ProjectHeader";
import { MilestoneList } from "./_components/MilestoneList";
import { TaskList } from "./_components/TaskList";
import { ProgressLogList } from "./_components/ProgressLogList";
import { getProjectById } from "../../../../_actions/projects/projects";
import { notFound } from "next/navigation";
import { ErrorFallback } from "../../emails/_components/error-fallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { id } = await params;
	const { data: project, error } = await getProjectById(id);

	if (error || !project) {
		notFound();
	}

	return (
		<div className="space-y-4">
			<PageHeader title={project.name} />
			<div className="container">
				<div className="space-y-6">
					<ProjectHeader project={project} />
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="space-y-6">
							<ErrorBoundary FallbackComponent={ErrorFallback}>
								<Suspense
									fallback={
										<Card>
											<CardHeader>
												<CardTitle>マイルストーン</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="h-32 bg-muted animate-pulse rounded" />
											</CardContent>
										</Card>
									}
								>
									<MilestoneList projectId={project.id} />
								</Suspense>
							</ErrorBoundary>

							<ErrorBoundary FallbackComponent={ErrorFallback}>
								<Suspense
									fallback={
										<Card>
											<CardHeader>
												<CardTitle>タスク</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="h-48 bg-muted animate-pulse rounded" />
											</CardContent>
										</Card>
									}
								>
									<TaskList projectId={project.id} />
								</Suspense>
							</ErrorBoundary>
						</div>

						<ErrorBoundary FallbackComponent={ErrorFallback}>
							<Suspense
								fallback={
									<Card>
										<CardHeader>
											<CardTitle>進捗ログ</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="h-96 bg-muted animate-pulse rounded" />
										</CardContent>
									</Card>
								}
							>
								<ProgressLogList projectId={project.id} />
							</Suspense>
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
