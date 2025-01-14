import { PERSONAL_PROJECTS } from "@/data/personal-projects";
import ProjectsHeader from "./_components/ProjectsHeader";
import ProjectsList from "./_components/ProjectsList";

export default function PersonalProjectsPage() {
	return (
		<div className="min-h-screen py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<ProjectsHeader />
				<ProjectsList projects={PERSONAL_PROJECTS} />
			</div>
		</div>
	);
}
