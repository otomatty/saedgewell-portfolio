import { Suspense } from "react";
import { requireAdmin } from "../../_actions/roles";
import { getProfile } from "../../_actions/profile";
import { getProjects } from "../../_actions/projects/projects";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./_components/admin-layout-client";
import { Skeleton } from "../../components/ui/skeleton";

// プロジェクトデータを取得するコンポーネント
async function ProjectsLoader() {
	const { data: projects, error } = await getProjects();
	if (error) {
		console.error("Error fetching projects:", error);
	}

	return (projects || []).map((project) => ({
		id: project.id,
		name: project.name,
		emoji: project.emoji || "📁",
	}));
}

// プロフィールデータを取得するコンポーネント
async function ProfileLoader() {
	const profile = await getProfile();
	if (!profile) {
		console.error("Profile not found");
		redirect("/");
	}
	return profile;
}

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		await requireAdmin();
	} catch (error) {
		console.error("Admin access denied:", error);
		redirect("/");
	}

	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			}
		>
			<AsyncAdminLayout>{children}</AsyncAdminLayout>
		</Suspense>
	);
}

// 非同期データ取得を行うレイアウトコンポーネント
async function AsyncAdminLayout({ children }: { children: React.ReactNode }) {
	const [profile, projects] = await Promise.all([
		ProfileLoader(),
		ProjectsLoader(),
	]);

	return (
		<AdminLayoutClient profile={profile} projects={projects}>
			<Suspense
				fallback={
					<div className="p-8">
						<div className="space-y-4">
							<Skeleton className="h-8 w-[250px]" />
							<Skeleton className="h-4 w-[350px]" />
							<div className="grid gap-4">
								<Skeleton className="h-[125px]" />
								<Skeleton className="h-[125px]" />
							</div>
						</div>
					</div>
				}
			>
				{children}
			</Suspense>
		</AdminLayoutClient>
	);
}
