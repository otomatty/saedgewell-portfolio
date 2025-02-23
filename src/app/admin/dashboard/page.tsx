import { ContributionOverview } from "@/components/custom/github/ContributionOverview";

export default function DashboardPage() {
	return (
		<div className="container mx-auto py-8 space-y-8">
			<h1 className="text-3xl font-bold">ダッシュボード</h1>
			<ContributionOverview />
		</div>
	);
}
