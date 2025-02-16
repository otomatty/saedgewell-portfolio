import {
	LayoutDashboard,
	FileText,
	Mail,
	Settings,
	Users,
	Briefcase,
	BookOpen,
} from "lucide-react";

export const navItems = [
	{
		title: "実績管理",
		url: "/admin/works",
		icon: Briefcase,
		items: [
			{
				title: "実績一覧",
				url: "/admin/works",
			},
			{
				title: "新規作成",
				url: "/admin/works/new",
			},
		],
	},
	{
		title: "ナレッジ管理",
		url: "/admin/knowledge",
		icon: BookOpen,
		items: [
			{
				title: "ナレッジトップ",
				url: "/admin/knowledge",
			},
			{
				title: "プロジェクト一覧",
				url: "/admin/knowledge/projects",
			},
			{
				title: "ページ一覧",
				url: "/admin/knowledge/pages",
			},
			{
				title: "同期",
				url: "/admin/knowledge/sync",
			},
		],
	},
	{
		title: "記事管理",
		url: "/admin/posts",
		icon: FileText,
		items: [
			{
				title: "記事一覧",
				url: "/admin/posts",
			},
			{
				title: "新規作成",
				url: "/admin/posts/new",
			},
			{
				title: "カテゴリー管理",
				url: "/admin/posts/categories",
			},
		],
	},
	{
		title: "お問い合わせ管理",
		url: "/admin/contacts",
		icon: Mail,
		items: [
			{
				title: "受信一覧",
				url: "/admin/contacts",
			},
			{
				title: "対応済み",
				url: "/admin/contacts/resolved",
			},
		],
	},
	{
		title: "ユーザー管理",
		url: "/admin/users",
		icon: Users,
		items: [
			{
				title: "ユーザー一覧",
				url: "/admin/users",
			},
			{
				title: "ロール管理",
				url: "/admin/users/roles",
			},
		],
	},
	{
		title: "スキル管理",
		url: "/admin/skills",
		icon: Briefcase,
		items: [
			{
				title: "スキル一覧",
				url: "/admin/skills",
			},
			{
				title: "新規作成",
				url: "/admin/skills/new",
			},
		],
	},
	{
		title: "設定",
		url: "/admin/settings",
		icon: Settings,
		items: [
			{
				title: "一般設定",
				url: "/admin/settings",
			},
			{
				title: "サイト設定",
				url: "/admin/settings/site",
			},
		],
	},
];
