import { requireAdmin } from "../../_actions/roles";
import { getProfile } from "../../_actions/profile";
import { getProjects } from "../../_actions/projects/projects";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./_components/admin-layout-client";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAdmin();
	const profile = await getProfile();
	const { data: projects, error } = await getProjects();

	if (!profile) {
		return redirect("/");
	}

	if (error) {
		console.error("Error fetching projects:", error);
	}

	const formattedProjects = (projects || []).map((project) => ({
		id: project.id,
		name: project.name,
		emoji: project.emoji || "📁", // デフォルトの絵文字を設定
	}));

	return (
		<AdminLayoutClient profile={profile} projects={formattedProjects}>
			{children}
		</AdminLayoutClient>
	);
}
