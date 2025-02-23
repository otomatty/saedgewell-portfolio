import { Suspense } from "react";
import { ProjectHeader } from "./_components/ProjectHeader";
import { MilestoneList } from "./_components/MilestoneList";
import { TaskList } from "./_components/TaskList";
import { ProgressLogList } from "./_components/ProgressLogList";
import { getProjectById } from "@/_actions/projects/projects";
import { notFound } from "next/navigation";

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
		<div className="container py-6 space-y-6">
			<ProjectHeader project={project} />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-6">
					<Suspense fallback={<div>Loading...</div>}>
						<MilestoneList projectId={project.id} />
					</Suspense>
					<Suspense fallback={<div>Loading...</div>}>
						<TaskList projectId={project.id} />
					</Suspense>
				</div>
				<div>
					<Suspense fallback={<div>Loading...</div>}>
						<ProgressLogList projectId={project.id} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
