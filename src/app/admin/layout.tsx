import { requireAdmin } from "../_actions/roles";
import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getProfile } from "../_actions/profile";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAdmin();
	const profile = await getProfile();

	if (!profile) {
		return redirect("/");
	}

	return (
		<SidebarProvider>
			<AdminSidebar profile={profile} />
			<SidebarInset>
				<AdminHeader
					breadcrumbs={[
						{ id: 1, label: "管理画面", href: "/admin" },
						{ id: 2, label: "ダッシュボード", current: true },
					]}
				/>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
