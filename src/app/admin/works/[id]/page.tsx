import { notFound } from "next/navigation";
import { getWorkById } from "@/app/_actions/works";
import { WorkFormTabs } from "../_components/form/WorkFormTabs";
import { BackLink } from "@/components/custom/BackLink";

interface WorkDetailPageProps {
	params: {
		id: string;
	};
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
	const work = await getWorkById(params.id).catch(() => null);

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
