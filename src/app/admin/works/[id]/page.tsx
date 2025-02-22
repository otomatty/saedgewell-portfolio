import { notFound } from "next/navigation";
import { getWorkById } from "@/_actions/works";
import { WorkFormTabs } from "../_components/form/WorkFormTabs";
import { BackLink } from "@/components/custom/BackLink";

interface WorkDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
	const { id } = await params;
	const work = await getWorkById(id).catch(() => null);

	if (!work) {
		notFound();
	}

	return (
		<div className="container py-8 space-y-8">
			<BackLink label="一覧に戻る" href="/admin/works" />
			<WorkFormTabs work={work} />
		</div>
	);
}
