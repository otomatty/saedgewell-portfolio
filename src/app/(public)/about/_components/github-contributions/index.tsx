import type React from "react";
import type { ContributionDay } from "@/app/_actions/github/getGithubContribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GithubContributionCalendar } from "./GithubContributionCalendar";
import { GithubContributionChart } from "./GithubContributionChart";
import { SectionTitle } from "@/components/custom/section-title";

interface GithubContributionsProps {
	contributions: ContributionDay[];
}

/**
 * GitHubのコントリビューションを表示するコンポーネント
 * @param {GithubContributionsProps} props
 * @returns {JSX.Element}
 */
export const GithubContributions: React.FC<GithubContributionsProps> = ({
	contributions,
}) => {
	return (
		<div>
			<SectionTitle
				title="GitHub Contributions"
				subtitle="GitHubのコントリビューションを表示します。"
			/>
			<Tabs defaultValue="calendar">
				<TabsList>
					<TabsTrigger value="calendar">Calendar</TabsTrigger>
					<TabsTrigger value="chart">Chart</TabsTrigger>
				</TabsList>
				<TabsContent value="calendar">
					<GithubContributionCalendar contributions={contributions} />
				</TabsContent>

				<TabsContent value="chart">
					<GithubContributionChart contributions={contributions} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
