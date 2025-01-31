"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];

/**
 * 全てのブログ記事を取得
 */
export async function getBlogPosts() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("blog_posts")
		.select(`
			*,
			blog_posts_categories(
				blog_categories(*)
			)
		`)
		.eq("status", "published")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Supabase Query Error:", {
			message: error.message,
			details: error.details,
			hint: error.hint,
			code: error.code,
		});
		throw new Error(`Failed to fetch blog posts: ${error.message}`);
	}

	return data;
}

/**
 * 公開済みの記事のスラッグ一覧を取得（ビルド時用）
 */
export async function getPublishedSlugsForBuild() {
	const { createClient } = await import("@supabase/supabase-js");
	const config = await import("@/lib/supabase/config").then((mod) =>
		mod.getSupabaseConfig(),
	);

	if (!config.url || !config.anonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	const supabase = createClient(config.url, config.anonKey);
	const { data, error } = await supabase
		.from("blog_posts")
		.select("slug")
		.eq("status", "published");

	if (error) {
		throw new Error(`Failed to fetch slugs: ${error.message}`);
	}

	return data.map((post) => post.slug);
}

/**
 * スラッグから記事を取得
 */
export async function getBlogPostBySlug(slug: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("blog_posts")
		.select(`
			*,
			blog_posts_categories(
				blog_categories(*)
			)
		`)
		.eq("slug", slug)
		.eq("status", "published")
		.single();

	if (error) {
		return null;
	}

	return data;
}

/**
 * カテゴリー別のブログ記事を取得
 */
export async function getBlogPostsByCategory(categoryId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("blog_posts")
		.select(`
      *,
      blog_posts_categories!inner(
        blog_categories!inner(*)
      )
    `)
		.eq("blog_posts_categories.category_id", categoryId)
		.eq("status", "published")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch blog posts by category: ${error.message}`);
	}

	return data;
}

/**
 * 全てのブログカテゴリーを取得
 */
export async function getBlogCategories() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("blog_categories")
		.select("*")
		.order("name");

	if (error) {
		throw new Error(`Failed to fetch blog categories: ${error.message}`);
	}

	return data as BlogCategory[];
}
