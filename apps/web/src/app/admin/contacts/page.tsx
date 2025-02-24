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
import { PageHeader } from "@/components/custom/page-header";

export default function ContactsPage() {
	return (
		<>
			<PageHeader title="お問い合わせ管理" />
			<div className="space-y-4 container">
				<Card>
					<CardHeader>
						<CardTitle>お問い合わせ一覧</CardTitle>
						<CardDescription>受信したお問い合わせの一覧</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>日時</TableHead>
									<TableHead>名前</TableHead>
									<TableHead>メールアドレス</TableHead>
									<TableHead>ステータス</TableHead>
									<TableHead>操作</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[...Array(5)].map((_, i) => (
									<TableRow key={`contact-skeleton-${i + 1}`}>
										<TableCell>
											<Skeleton className="h-4 w-24" />
										</TableCell>
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
											<Skeleton className="h-8 w-20" />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
