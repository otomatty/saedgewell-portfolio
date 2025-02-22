import { requireAdmin } from "../../_actions/roles";
import { getProfile } from "../../_actions/profile";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./_components/admin-layout-client";

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

	return <AdminLayoutClient profile={profile}>{children}</AdminLayoutClient>;
}
