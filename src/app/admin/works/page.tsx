import { Suspense } from "react";
import { getWorks } from "@/app/_actions/works";
import { WorksHeader } from "./_components/WorksHeader";
import { WorksTable } from "./_components/WorksTable";
import { WorksTableSkeleton } from "./_components/WorksTableSkeleton";
import type { WorkStatus, WorkCategory } from "@/types/work";
export default async function WorksPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const works = await getWorks({
		status: searchParams.status as WorkStatus,
		category: searchParams.category as WorkCategory,
		query: searchParams.query,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<WorksHeader />
			<Suspense fallback={<WorksTableSkeleton />}>
				<WorksTable works={works} />
			</Suspense>
		</div>
	);
}
