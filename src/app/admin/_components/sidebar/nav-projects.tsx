"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

interface Project {
	name: string;
	url: string;
	emoji: string;
}

// パスが一致するかどうかを確認するユーティリティ関数
function isActiveLink(currentPath: string, itemPath: string): boolean {
	return currentPath.startsWith(itemPath);
}

export function NavProjects({ projects }: { projects: Project[] }) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>プロジェクト</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							asChild
							isActive={isActiveLink(pathname, item.url)}
						>
							<Link href={item.url} className="flex items-center gap-2">
								<span className="flex h-4 w-4 items-center justify-center text-base leading-none">
									{item.emoji}
								</span>
								<span className="flex-1">{item.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
