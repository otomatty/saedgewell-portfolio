import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { Noto_Sans_JP, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	preload: true,
	display: "swap",
});

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	preload: true,
	display: "swap",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<head>
				<meta name="application-name" content="Saedgewell" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Saedgewell" />
				<meta name="description" content="菅井瑛正のポートフォリオサイト" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#000000" />
				<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
			</head>
			<body className={`${notoSansJP.className} ${inter.className}`}>
				<ThemeProvider>
					<div className="relative min-h-screen flex flex-col">
						{children}
						<Toaster />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
