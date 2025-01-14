import { PERSONAL_PROJECTS } from "@/data/personal-projects";
import { notFound } from "next/navigation";
import ProjectDetail from "../_components/ProjectDetail";
import RelatedProjects from "../_components/RelatedProjects";

type Props = {
	params: {
		id: string;
	};
};

export default function ProjectDetailPage({ params }: Props) {
	const project = PERSONAL_PROJECTS.find((p) => p.id === params.id);

	if (!project) {
		notFound();
	}

	return (
		<div className="min-h-screen py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<ProjectDetail project={project} />
				<RelatedProjects currentProject={project} />
			</div>
		</div>
	);
}
