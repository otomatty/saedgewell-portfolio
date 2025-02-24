import { PageHeader } from "@/components/custom/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SKELETON_ITEMS = Array.from(
	{ length: 5 },
	(_, i) => `project-skeleton-${i + 1}`,
);

export default function Loading() {
	return (
		<div className="space-y-4">
			<PageHeader
				title="プロジェクト"
				actions={<Skeleton className="h-10 w-32" />}
			/>
			<div className="container">
				<div className="space-y-4">
					{SKELETON_ITEMS.map((id) => (
						<Card key={id}>
							<CardContent className="p-6">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<Skeleton className="h-6 w-[200px]" />
										<Skeleton className="h-4 w-[300px]" />
										<div className="flex gap-2 mt-4">
											<Skeleton className="h-6 w-16" />
											<Skeleton className="h-6 w-16" />
										</div>
									</div>
									<Skeleton className="h-8 w-8 rounded-full" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
