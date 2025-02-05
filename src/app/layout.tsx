import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

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
			<body className={notoSansJP.className}>
				<div className="relative min-h-screen flex flex-col">
					{children}
					<Toaster />
				</div>
			</body>
		</html>
	);
}
