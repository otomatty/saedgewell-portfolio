"use client";

import { AdminHeader } from "./header";
import { AdminSidebar } from "./sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Profile } from "@/types/profile";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/store/sidebar";

interface AdminLayoutClientProps {
	children: React.ReactNode;
	profile: Profile;
}

export function AdminLayoutClient({
	children,
	profile,
}: AdminLayoutClientProps) {
	const [open, setOpen] = useAtom(sidebarOpenAtom);

	return (
		<SidebarProvider open={open} onOpenChange={setOpen}>
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
