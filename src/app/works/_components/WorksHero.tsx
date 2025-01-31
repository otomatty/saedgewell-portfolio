"use client";

import { Hero } from "@/components/custom/Hero";

export function WorksHero() {
	return (
		<section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="container py-20">
				<div className="max-w-3xl">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						実績一覧
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						企業案件、フリーランス案件、個人開発など、これまでに手がけた主要なプロジェクトをご紹介します。
						各プロジェクトの詳細、使用技術、課題解決のプロセスなどをご覧いただけます。
					</p>
				</div>
			</div>
		</section>
	);
}
