import { Skeleton } from "../../../components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";

export default function UsersPage() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">ユーザー管理</h1>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>総ユーザー数</CardTitle>
						<CardDescription>登録済みの全ユーザー数</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-8 w-20" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>アクティブユーザー</CardTitle>
						<CardDescription>直近30日間のアクティブユーザー</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-8 w-20" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>新規登録</CardTitle>
						<CardDescription>今月の新規登録ユーザー</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-8 w-20" />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>ユーザー一覧</CardTitle>
					<CardDescription>登録済みユーザーの一覧</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>名前</TableHead>
								<TableHead>メールアドレス</TableHead>
								<TableHead>ロール</TableHead>
								<TableHead>登録日</TableHead>
								<TableHead>最終ログイン</TableHead>
								<TableHead>操作</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={`user-skeleton-${crypto.randomUUID()}`}>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-48" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-20" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-24" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-24" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-8 w-20" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
