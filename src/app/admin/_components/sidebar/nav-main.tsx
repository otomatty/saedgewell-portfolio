"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Play, Folder } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	useSidebar,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavProjects } from "./nav-projects";

interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
	category?: string;
	dbName?: string;
}

interface AdminNavMainProps {
	items: NavItem[];
}

// パスが一致するかどうかを確認するユーティリティ関数
function isActiveLink(currentPath: string, itemPath: string): boolean {
	// 完全一致の場合
	if (currentPath === itemPath) return true;
	// ダッシュボードの場合は完全一致のみ
	if (itemPath === "/admin") return currentPath === "/admin";
	// その他のページは前方一致（サブページも含む）
	return currentPath.startsWith(itemPath);
}

// サンプルプロジェクトデータ
const sampleProjects = [
	{
		name: "ポートフォリオサイト",
		url: "/admin/projects/portfolio",
		emoji: "🎨",
	},
	{
		name: "ECサイト",
		url: "/admin/projects/ec",
		emoji: "🛍️",
	},
	{
		name: "SNSアプリ",
		url: "/admin/projects/sns",
		emoji: "💬",
	},
];

export function AdminNavMain({ items }: AdminNavMainProps) {
	const pathname = usePathname();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	// ダッシュボードとカテゴリー別のアイテムを分離
	const dashboardItem = items.find((item) => !item.category);
	const workItems = items.filter((item) => item.category === "作業");
	const customerItems = items.filter((item) => item.category === "顧客対応");
	const portfolioItems = items.filter(
		(item) => item.category === "ポートフォリオ",
	);

	return (
		<>
			{/* 開始ボタン */}
			<SidebarGroup>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							asChild
							className="w-full gap-2 transition-all duration-200"
							size={isCollapsed ? "icon" : "lg"}
							variant="default"
						>
							<Link href="/admin/focus">
								<Play className="h-4 w-4" />
								{!isCollapsed && <span>開始</span>}
							</Link>
						</Button>
					</TooltipTrigger>
					{isCollapsed && <TooltipContent side="right">開始</TooltipContent>}
				</Tooltip>
			</SidebarGroup>

			{/* ダッシュボード */}
			{dashboardItem && (
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={isActiveLink(pathname, dashboardItem.url)}
							>
								<Link
									href={dashboardItem.url}
									className="flex items-center gap-2"
								>
									<dashboardItem.icon className="h-4 w-4" />
									<span>{dashboardItem.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			)}

			{/* 作業カテゴリー */}
			{workItems.length > 0 && (
				<SidebarGroup>
					<SidebarGroupLabel>作業</SidebarGroupLabel>
					<SidebarMenu>
						{workItems.map((item) => (
							<SidebarMenuItem key={item.url}>
								<SidebarMenuButton
									asChild
									isActive={isActiveLink(pathname, item.url)}
								>
									<Link href={item.url} className="flex items-center gap-2">
										<item.icon className="h-4 w-4" />
										<span className="flex-1">{item.title}</span>
										{item.dbName && (
											<span className="text-xs text-muted-foreground">
												{item.dbName}
											</span>
										)}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			)}
			<SidebarSeparator />
			{/* プロジェクト一覧 */}
			<NavProjects projects={sampleProjects} />

			<SidebarSeparator />
			{/* 顧客対応カテゴリー */}
			{customerItems.length > 0 && (
				<SidebarGroup>
					<SidebarGroupLabel>顧客対応</SidebarGroupLabel>
					<SidebarMenu>
						{customerItems.map((item) => (
							<SidebarMenuItem key={item.url}>
								<SidebarMenuButton
									asChild
									isActive={isActiveLink(pathname, item.url)}
								>
									<Link href={item.url} className="flex items-center gap-2">
										<item.icon className="h-4 w-4" />
										<span className="flex-1">{item.title}</span>
										{item.dbName && (
											<span className="text-xs text-muted-foreground">
												{item.dbName}
											</span>
										)}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			)}
			<SidebarSeparator />
			{/* ポートフォリオカテゴリー */}
			{portfolioItems.length > 0 && (
				<SidebarGroup>
					<SidebarGroupLabel>ポートフォリオ</SidebarGroupLabel>
					<SidebarMenu>
						{portfolioItems.map((item) => (
							<SidebarMenuItem key={item.url}>
								<SidebarMenuButton
									asChild
									isActive={isActiveLink(pathname, item.url)}
								>
									<Link href={item.url} className="flex items-center gap-2">
										<item.icon className="h-4 w-4" />
										<span className="flex-1">{item.title}</span>
										{item.dbName && (
											<span className="text-xs text-muted-foreground">
												{item.dbName}
											</span>
										)}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			)}
		</>
	);
}
