import { Suspense } from "react";
import { CreateProjectButton } from "./_components/CreateProjectButton";
import { ProjectList } from "./_components/ProjectList";

export default function ProjectsPage() {
	return (
		<div className="container py-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">プロジェクト</h1>
				<CreateProjectButton />
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<ProjectList />
			</Suspense>
		</div>
	);
}
