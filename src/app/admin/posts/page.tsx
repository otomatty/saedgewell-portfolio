import {
	getBlogPostsForAdmin,
	getBlogStats,
	getBlogPostsCountByCategory,
	getDraftBlogPostsCount,
} from "@/_actions/blog";
import { StatsCard } from "./_components/stats-card";
import { Book, BookOpenCheck, Tag, File } from "lucide-react";
import { BlogPostList } from "./_components/blog-post-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AdminPostsPage = async () => {
	const blogPosts = await getBlogPostsForAdmin();
	const stats = await getBlogStats();
	const categoryCounts = await getBlogPostsCountByCategory();
	const draftCount = await getDraftBlogPostsCount();

	return (
		<div className="container space-y-8 py-8">
			<h1 className="text-3xl font-bold">ブログ管理ダッシュボード</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard title="総記事数" value={stats.totalPosts} icon={<Book />} />
				<StatsCard
					title="公開済み記事数"
					value={stats.totalPublishedPosts}
					icon={<BookOpenCheck />}
				/>
				<StatsCard title="下書き記事数" value={draftCount} icon={<File />} />
				{categoryCounts.map((category) => (
					<StatsCard
						key={category.id}
						title={`${category.name}の記事数`}
						value={category.count}
						icon={<Tag />}
					/>
				))}
			</div>

			<div>
				<h2 className="text-2xl font-bold">最近のブログ記事</h2>
				<BlogPostList blogPosts={blogPosts} />
			</div>

			<Link href="/admin/posts/create">
				<Button>ブログ記事を作成</Button>
			</Link>
		</div>
	);
};

export default AdminPostsPage;
