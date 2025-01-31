"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredBlogs = [
	{
		title: "Next.js 14でのサーバーアクションの活用方法",
		date: "2024-02-15",
		excerpt:
			"Next.js 14の新機能であるサーバーアクションの効果的な使用方法について解説します。",
		slug: "nextjs-14-server-actions",
		image: "/images/blog/nextjs-14.jpg",
	},
	{
		title: "Supabaseを使用した認証システムの実装",
		date: "2024-02-01",
		excerpt:
			"SupabaseとNext.jsを組み合わせた認証システムの実装方法を詳しく解説します。",
		slug: "supabase-auth-implementation",
		image: "/images/blog/supabase-auth.jpg",
	},
];

const featuredWorks = [
	{
		title: "AI教育支援プラットフォーム",
		category: "企業案件",
		description: "AIを活用した個別最適化学習プラットフォームの開発",
		image: "/images/works/education-platform.jpg",
		link: "/works/company/education-platform",
	},
	{
		title: "クラウドネイティブCMS",
		category: "個人開発",
		description: "Next.jsとSupabaseを使用したモダンなCMSの開発",
		image: "/images/works/cloud-cms.jpg",
		link: "/works/personal/cloud-cms",
	},
];

export const Featured = () => {
	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				{/* Featured Blog Posts */}
				<div className="mb-20">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl md:text-3xl font-bold">最新のブログ記事</h2>
						<Button variant="ghost" asChild>
							<Link href="/blog">
								もっと見る
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="grid md:grid-cols-2 gap-6">
						{featuredBlogs.map((blog, index) => (
							<motion.div
								key={blog.slug}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Link href={`/blog/${blog.slug}`}>
									<Card className="h-full hover:shadow-lg transition-shadow">
										<div className="relative h-48 w-full">
											<Image
												src={blog.image}
												alt={blog.title}
												fill
												className="object-cover rounded-t-lg"
											/>
										</div>
										<CardContent className="p-6">
											<div className="text-sm text-muted-foreground mb-2">
												{blog.date}
											</div>
											<h3 className="text-xl font-semibold mb-2">
												{blog.title}
											</h3>
											<p className="text-muted-foreground">{blog.excerpt}</p>
										</CardContent>
									</Card>
								</Link>
							</motion.div>
						))}
					</div>
				</div>

				{/* Featured Works */}
				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl md:text-3xl font-bold">注目の制作実績</h2>
						<Button variant="ghost" asChild>
							<Link href="/works">
								もっと見る
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="grid md:grid-cols-2 gap-6">
						{featuredWorks.map((work, index) => (
							<motion.div
								key={work.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Link href={work.link}>
									<Card className="h-full hover:shadow-lg transition-shadow">
										<div className="relative h-48 w-full">
											<Image
												src={work.image}
												alt={work.title}
												fill
												className="object-cover rounded-t-lg"
											/>
										</div>
										<CardContent className="p-6">
											<div className="text-sm text-primary font-medium mb-2">
												{work.category}
											</div>
											<h3 className="text-xl font-semibold mb-2">
												{work.title}
											</h3>
											<p className="text-muted-foreground">
												{work.description}
											</p>
										</CardContent>
									</Card>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
