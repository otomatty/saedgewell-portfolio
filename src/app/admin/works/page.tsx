import { Suspense } from "react";
import { getWorks } from "@/app/_actions/works";
import { WorksHeader } from "./_components/WorksHeader";
import { WorksTable } from "./_components/WorksTable";
import { WorksTableSkeleton } from "./_components/WorksTableSkeleton";
import type { WorkStatus, WorkCategory } from "@/types/work";
export default async function WorksPage() {
	const works = await getWorks({
		status: "all",
		category: "all",
		query: "",
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
