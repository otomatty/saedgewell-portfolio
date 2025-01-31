import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/app/_layout/Header";
import { Footer } from "@/app/_layout/Footer";
import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Saedgewell Portfolio",
		template: "%s | Saedgewell Portfolio",
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className={notoSansJP.className}>
				<div className="relative min-h-screen flex flex-col">
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
