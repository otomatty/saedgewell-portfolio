import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import { BlogDetailHero } from "./_components/BlogDetailHero";
import { BlogContent } from "./_components/BlogContent";
import {
	getPublishedSlugsForBuild,
	getBlogPostBySlug,
} from "../../../../_actions/blog";

export async function generateStaticParams() {
	const slugs = await getPublishedSlugsForBuild();
	return slugs.map((slug) => ({
		slug,
	}));
}

type PageProps = {
	params: Promise<{ slug: string }>;
};

// export async function generateMetadata(props: {
// 	params: Promise<{ slug: string }>;
// }): Promise<Metadata | undefined> {
// 	const { slug } = await props.params;
// 	const post = await getBlogPostBySlug(slug);

// 	if (!post) {
// 		return {
// 			title: "Not Found",
// 			description: "ページが見つかりませんでした。",
// 		};
// 	}

// 	return {
// 		title: post.title,
// 		description: post.description,
// 		openGraph: {
// 			title: post.title,
// 			description: post.description,
// 			type: "article",
// 			publishedTime: post.created_at
// 				? new Date(post.created_at).toISOString()
// 				: undefined,
// 			authors: ["Akimasa Sugai"],
// 		},
// 	};
// }

export default async function BlogDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const mdxSource = await serialize(post.content);

	return (
		<main>
			<BlogDetailHero
				title={post.title}
				description={post.description}
				publishedAt={
					new Date(post.created_at ?? "").toISOString().split("T")[0]
				}
				categories={post.blog_posts_categories
					.map((pc) => pc.blog_categories?.name ?? "")
					.filter(Boolean)}
				estimatedReadingTime={post.estimated_reading_time}
			/>
			<div className="container py-20">
				<BlogContent content={mdxSource} />
			</div>
		</main>
	);
}
