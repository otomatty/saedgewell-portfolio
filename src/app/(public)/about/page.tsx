import type { Metadata } from "next";
import { AboutHero } from "./_components/AboutHero";
import { AboutHeader } from "./_components/AboutHeader";
import { Career } from "./_components/Career";
import { Values } from "./_components/Values";
import { TechStack } from "./_components/TechStack";
import { Certifications } from "./_components/Certifications";
import { Interests } from "./_components/Interests";
import { Featured } from "./_components/Featured";
import { GithubContributions } from "@/app/(public)/about/_components/github-contributions";
import { getGithubContribution } from "@/_actions/github/getGithubContribution";
import type { ContributionDay } from "@/_actions/github/getGithubContribution";

export const metadata: Metadata = {
	title: "About Me",
	description:
		"プロダクトエンジニアとして、モダンな技術を活用したWeb開発に携わっています。",
};

export default async function AboutPage() {
	const githubUsername = "otomatty"; // 自身のGithubのユーザー名
	const githubToken = process.env.GITHUB_TOKEN;

	let contributions: ContributionDay[] = [];
	let errorMessage: string | null = null;

	if (!githubToken) {
		errorMessage = "GITHUB_TOKENが設定されていません。";
	} else {
		try {
			contributions = await getGithubContribution(githubUsername, githubToken);
		} catch (error: unknown) {
			if (error instanceof Error) {
				errorMessage = `GitHubのコントリビューションの取得に失敗しました: ${error.message}`;
			} else {
				errorMessage = "GitHubのコントリビューションの取得に失敗しました。";
			}
		}
	}

	return (
		<main>
			<AboutHero />
			<div className="container py-20 space-y-32">
				<AboutHeader />
				<Career />
				<Values />
				<TechStack />
				<Certifications />
				<Interests />
				<Featured />
				{githubToken && !errorMessage && (
					<GithubContributions contributions={contributions} />
				)}
			</div>
		</main>
	);
}
