"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import {
	LayoutDashboard,
	FolderKanban,
	MessageSquare,
	FileText,
	Settings,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "../../../components/ui/sidebar";
import { NavUser } from "./NavUser";
import type { User } from "@supabase/supabase-js";

const navigation = [
	{
		title: "ダッシュボード",
		href: "/app/dashboard",
		icon: LayoutDashboard,
		items: [],
	},
	{
		title: "プロジェクト",
		href: "/app/projects",
		icon: FolderKanban,
		items: [
			{
				title: "進行中",
				href: "/app/projects/active",
			},
			{
				title: "完了",
				href: "/app/projects/completed",
			},
		],
	},
	{
		title: "メッセージ",
		href: "/app/messages",
		icon: MessageSquare,
		items: [],
	},
	{
		title: "ドキュメント",
		href: "/app/documents",
		icon: FileText,
		items: [],
	},
	{
		title: "設定",
		href: "/app/settings",
		icon: Settings,
		items: [
			{
				title: "プロフィール",
				href: "/app/settings/profile",
			},
			{
				title: "セキュリティ",
				href: "/app/settings/security",
			},
		],
	},
] as const;

export function AuthSidebar({ user }: { user: User }) {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<Link href="/app/dashboard" className="flex items-center space-x-2">
					<span className="text-lg font-semibold">Client Portal</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<nav className="space-y-1 px-2">
					{navigation.map((item) => {
						const isActive = pathname.startsWith(item.href);
						return (
							<div key={item.title} className="space-y-1">
								<Link
									href={item.href}
									className={cn(
										"flex items-center rounded-lg px-3 py-2 text-sm font-medium",
										isActive
											? "bg-primary text-primary-foreground"
											: "hover:bg-muted",
									)}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.title}
								</Link>
								{item.items.length > 0 && isActive && (
									<div className="ml-6 space-y-1">
										{item.items.map((subItem) => (
											<Link
												key={subItem.title}
												href={subItem.href}
												className={cn(
													"block rounded-lg px-3 py-2 text-sm font-medium",
													pathname === subItem.href
														? "bg-primary text-primary-foreground"
														: "hover:bg-muted",
												)}
											>
												{subItem.title}
											</Link>
										))}
									</div>
								)}
							</div>
						);
					})}
				</nav>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
