import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const columns = [
	{
		accessorKey: "title",
		header: "タイトル",
		cell: ({ row }) => {
			return (
				<div>
					<p className="font-medium">{row.original.title}</p>
					<p className="text-sm text-muted-foreground">
						{row.original.projectName}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "linkedCount",
		header: "リンク数",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-1">
					<LinkIcon className="h-4 w-4" />
					<span>{row.original.linkedCount}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "views",
		header: "閲覧数",
	},
	{
		accessorKey: "updatedAt",
		header: "更新日時",
		cell: ({ row }) => {
			return (
				<span className="text-muted-foreground">{row.original.updatedAt}</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Link href={`/admin/knowledge/pages/${row.original.id}`}>
						<Button variant="ghost" size="icon">
							<Eye className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

const data = [
	{
		id: "1",
		title: "Next.js 15の新機能",
		projectName: "tech-notes",
		linkedCount: 5,
		views: 100,
		updatedAt: "1時間前",
	},
	{
		id: "2",
		title: "TypeScriptのベストプラクティス",
		projectName: "tech-notes",
		linkedCount: 3,
		views: 80,
		updatedAt: "2時間前",
	},
	{
		id: "3",
		title: "Supabaseの認証機能",
		projectName: "tech-notes",
		linkedCount: 2,
		views: 60,
		updatedAt: "3時間前",
	},
];

export function PageList() {
	return <DataTable columns={columns} data={data} />;
}
