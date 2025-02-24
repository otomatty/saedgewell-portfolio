import {
	LayoutDashboard,
	FileText,
	Mail,
	Settings,
	Users,
	Briefcase,
	BookOpen,
	MessageSquare,
	CheckSquare,
	MessageCircle,
	GraduationCap,
	Folder,
	AppWindow,
	Github,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
	category?: string;
	dbName?: string;
}

export const navItems: NavItem[] = [
	{
		title: "ダッシュボード",
		url: "/admin",
		icon: LayoutDashboard,
	},
	// 作業カテゴリー
	{
		title: "プロジェクト",
		url: "/admin/projects",
		icon: Folder,
		category: "作業",
		dbName: "projects",
	},
	{
		title: "タスク",
		url: "/admin/tasks",
		icon: CheckSquare,
		category: "作業",
		dbName: "tasks",
	},
	// 顧客対応カテゴリー
	{
		title: "チャット",
		url: "/admin/chat",
		icon: MessageCircle,
		category: "顧客対応",
		dbName: "chat",
	},
	{
		title: "お問い合わせ",
		url: "/admin/contacts",
		icon: MessageSquare,
		category: "顧客対応",
		dbName: "contacts",
	},
	{
		title: "メール",
		url: "/admin/emails",
		icon: Mail,
		category: "顧客対応",
		dbName: "emails",
	},
	// ポートフォリオカテゴリー
	{
		title: "実績",
		url: "/admin/works",
		icon: Briefcase,
		category: "ポートフォリオ",
		dbName: "works",
	},
	{
		title: "ナレッジ",
		url: "/admin/knowledge",
		icon: BookOpen,
		category: "ポートフォリオ",
		dbName: "knowledge",
	},
	{
		title: "記事",
		url: "/admin/posts",
		icon: FileText,
		category: "ポートフォリオ",
		dbName: "posts",
	},
	{
		title: "ユーザー",
		url: "/admin/users",
		icon: Users,
		category: "ポートフォリオ",
		dbName: "users",
	},
	{
		title: "スキル",
		url: "/admin/skills",
		icon: GraduationCap,
		category: "ポートフォリオ",
		dbName: "skills",
	},
	// 設定
	{
		title: "設定",
		url: "/admin/settings",
		icon: Settings,
		category: "設定",
		dbName: "settings",
	},
	{
		title: "サイト設定",
		url: "/admin/settings/site",
		icon: AppWindow,
		category: "設定",
	},
	{
		title: "Github",
		url: "/admin/settings/github",
		icon: Github,
		category: "設定",
	},
];
