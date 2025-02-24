import type { Metadata } from "next";
import { Header } from "./_layout/Header";
import { Footer } from "./_layout/Footer";
import { getProfileOnTop } from "../../_actions/profile";

export const metadata: Metadata = {
	title: {
		default: "Saedgewell | 菅井瑛正",
		template: "%s | Saedgewell | 菅井瑛正",
	},
	description: "プロダクトエンジニア 菅井瑛正のポートフォリオサイトです。",
	keywords: [
		"プロダクトエンジニア",
		"Web開発",
		"Next.js",
		"React",
		"TypeScript",
		"ポートフォリオ",
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const profile = await getProfileOnTop();
	return (
		<>
			<Header profile={profile} />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	);
}
