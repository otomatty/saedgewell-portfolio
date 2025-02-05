import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/app/_actions/users";
import { getAdminStats } from "@/app/_actions/admin";
import { DataTable } from "@/components/ui/data-table";
import { UserFilter } from "./_components/user-filter";
import { columns } from "./_components/columns";
import { StatsCard } from "./_components/stats-card";
import { StatsGraph } from "./_components/stats-graph";
import { Users, UserPlus, UserCheck, MessageSquare } from "lucide-react";

interface PageProps {
	searchParams: {
		page?: string;
		search?: string;
		role?: string;
	};
}

export default async function AdminPage({ searchParams }: PageProps) {
	const page = Number(searchParams.page) || 1;
	const [initialData, stats] = await Promise.all([
		getUsers({
			page,
			limit: 10,
			search: searchParams.search,
			role: searchParams.role,
		}),
		getAdminStats(),
	]);

	return (
		<div className="container space-y-8 py-8">
			<h1 className="text-3xl font-bold">管理者ページ</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="総ユーザー数"
					value={stats.totalUsers}
					icon={<Users />}
				/>
				<StatsCard
					title="新規ユーザー"
					value={stats.newUsers.count}
					description="今月の新規登録"
					icon={<UserPlus />}
					trend={{
						value: stats.newUsers.trend,
						isPositive: stats.newUsers.trend > 0,
					}}
				/>
				<StatsCard
					title="アクティブユーザー"
					value={stats.activeUsers.count}
					description="過去30日間"
					icon={<UserCheck />}
					trend={{
						value: stats.activeUsers.trend,
						isPositive: stats.activeUsers.trend > 0,
					}}
				/>
				<StatsCard
					title="未対応のお問い合わせ"
					value={stats.pendingContacts}
					icon={<MessageSquare />}
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Suspense fallback={<Skeleton className="h-[400px]" />}>
					<StatsGraph
						title="ユーザー統計"
						data={stats.graphs.userStats}
						type="users"
					/>
				</Suspense>
				<Suspense fallback={<Skeleton className="h-[400px]" />}>
					<StatsGraph
						title="アクティビティ統計"
						data={stats.graphs.activityStats}
						type="activity"
					/>
				</Suspense>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">ユーザー管理</h2>
					<UserFilter />
				</div>

				<Suspense fallback={<Skeleton className="h-[400px]" />}>
					<Card>
						<CardContent className="pt-6">
							<DataTable columns={columns} data={initialData.users} />
						</CardContent>
					</Card>
				</Suspense>
			</div>
		</div>
	);
}

export const metadata = {
	title: "管理者ページ",
	description: "サイトの管理を行います。",
};
