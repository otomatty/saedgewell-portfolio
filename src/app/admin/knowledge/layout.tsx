import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface Props {
	children: React.ReactNode;
}

export default function KnowledgeLayout({ children }: Props) {
	return (
		<div className="space-y-6">
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="w-full justify-start">
					<Link href="/admin/knowledge">
						<TabsTrigger value="overview">概要</TabsTrigger>
					</Link>
					<Link href="/admin/knowledge/projects">
						<TabsTrigger value="projects">プロジェクト</TabsTrigger>
					</Link>
					<Link href="/admin/knowledge/pages">
						<TabsTrigger value="pages">ページ</TabsTrigger>
					</Link>
					<Link href="/admin/knowledge/sync">
						<TabsTrigger value="sync">同期</TabsTrigger>
					</Link>
				</TabsList>
			</Tabs>

			{children}
		</div>
	);
}
