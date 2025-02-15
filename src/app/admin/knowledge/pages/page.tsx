import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageList } from "./_components/page-list";
import { PageSearch } from "./_components/page-search";

export default async function KnowledgePagesPage() {
	return (
		<div className="container space-y-8 py-8">
			<h1 className="text-3xl font-bold">ページ管理</h1>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>ページ検索</CardTitle>
					</CardHeader>
					<CardContent>
						<PageSearch />
					</CardContent>
				</Card>

				<Suspense fallback={<Skeleton className="h-[600px]" />}>
					<Card>
						<CardHeader>
							<CardTitle>ページ一覧</CardTitle>
						</CardHeader>
						<CardContent>
							<PageList />
						</CardContent>
					</Card>
				</Suspense>
			</div>
		</div>
	);
}

export const metadata = {
	title: "ページ管理 - ナレッジベース",
	description: "ナレッジベースのページを管理します。",
};
