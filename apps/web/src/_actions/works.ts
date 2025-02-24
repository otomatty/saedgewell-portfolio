"use server";

import { createClient } from "../lib/supabase/server";
import { createClient as createStaticClient } from "../lib/supabase/client";
import type { Work, WorksFilter } from "../types/work";
import { revalidatePath } from "next/cache";

/**
 * 全ての実績を取得
 */
export async function getWorks(filter?: WorksFilter) {
	const supabase = await createClient();

	let query = supabase
		.from("works")
		.select("*")
		.order("created_at", { ascending: false });

	// ステータスでフィルタリング
	if (filter?.status && filter.status !== "all") {
		query = query.eq("status", filter.status);
	}

	// カテゴリーでフィルタリング
	if (filter?.category && filter.category !== "all") {
		query = query.eq("category", filter.category);
	}

	// タイトルで検索
	if (filter?.query) {
		query = query.ilike("title", `%${filter.query}%`);
	}

	const { data: works, error } = await query;

	if (error) {
		throw new Error("実績の取得に失敗しました");
	}

	return works as Work[];
}

/**
 * スラッグから実績を取得
 */
export async function getWorkBySlug(slug?: string) {
	const supabase = await createClient();

	if (slug) {
		const { data, error } = await supabase
			.from("works")
			.select(`
        *,
        work_details(*),
        work_images(*),
        work_responsibilities(*),
        work_challenges(*),
        work_solutions(*),
        work_results(*),
        work_technologies(
          technologies(*)
        )
      `)
			.eq("status", "published")
			.eq("slug", slug)
			.single();

		if (error) {
			throw new Error(`Failed to fetch work: ${error.message}`);
		}

		return data;
	}

	const { data, error } = await supabase
		.from("works")
		.select(`
      *,
      work_details(*),
      work_images(*),
      work_responsibilities(*),
      work_challenges(*),
      work_solutions(*),
      work_results(*),
      work_technologies(
        technologies(*)
      )
    `)
		.eq("status", "published");

	if (error) {
		throw new Error(`Failed to fetch works: ${error.message}`);
	}

	return data;
}

/**
 * カテゴリー別の実績を取得
 */
export async function getWorksByCategory(category: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("works")
		.select(`
      *,
      work_details(*),
      work_images(*),
      work_responsibilities(*),
      work_challenges(*),
      work_solutions(*),
      work_results(*),
      work_technologies(
        technologies(*)
      )
    `)
		.eq("category", category)
		.eq("status", "published")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch works by category: ${error.message}`);
	}

	return data;
}

// ビルド時用の関数
export async function getWorkSlugsForBuild() {
	const supabase = createStaticClient();
	const { data, error } = await supabase
		.from("works")
		.select("slug")
		.eq("status", "published");

	if (error) {
		throw new Error(`Failed to fetch works: ${error.message}`);
	}

	return data;
}

/**
 * 実績を削除
 */
export async function deleteWork(id: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("works").delete().eq("id", id);

	if (error) {
		throw new Error("実績の削除に失敗しました");
	}

	revalidatePath("/admin/works");
}

/**
 * 複数の実績を削除
 */
export async function deleteWorks(ids: string[]) {
	const supabase = await createClient();

	const { error } = await supabase.from("works").delete().in("id", ids);

	if (error) {
		throw new Error("実績の削除に失敗しました");
	}

	revalidatePath("/admin/works");
}

/**
 * IDから実績を取得
 */
export async function getWorkById(id: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("works")
		.select(`
			*,
			work_details(*),
			work_images(*),
			work_responsibilities(*),
			work_challenges(*),
			work_solutions(*),
			work_results(*),
			work_technologies(
				technologies(*)
			)
		`)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error("実績の取得に失敗しました");
	}

	return {
		...data,
		category: data.category as Work["category"],
		status: data.status as Work["status"],
	} as Work;
}

/**
 * 実績を更新
 */
export async function updateWork(id: string, data: Partial<Work>) {
	const supabase = await createClient();

	const { error } = await supabase
		.from("works")
		.update({
			...data,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) {
		throw new Error("実績の更新に失敗しました");
	}

	revalidatePath("/admin/works");
}

/**
 * 実績の詳細情報を更新
 */
export async function updateWorkDetail(
	workId: string,
	data: {
		overview: string;
		role: string;
		period: string;
		team_size: string;
	},
) {
	const supabase = await createClient();

	const { error } = await supabase
		.from("work_details")
		.upsert({
			work_id: workId,
			...data,
			updated_at: new Date().toISOString(),
		})
		.eq("work_id", workId);

	if (error) {
		throw new Error("詳細情報の更新に失敗しました");
	}

	revalidatePath(`/admin/works/${workId}`);
}

/**
 * 実績の担当業務を更新
 */
export async function updateWorkResponsibilities(
	workId: string,
	responsibilities: { description: string }[],
) {
	const supabase = await createClient();

	// 既存の担当業務を削除
	const { error: deleteError } = await supabase
		.from("work_responsibilities")
		.delete()
		.eq("work_id", workId);

	if (deleteError) {
		throw new Error("担当業務の削除に失敗しました");
	}

	// 新しい担当業務を追加
	const { error: insertError } = await supabase
		.from("work_responsibilities")
		.insert(
			responsibilities.map((responsibility, index) => ({
				work_id: workId,
				description: responsibility.description,
				sort_order: index,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})),
		);

	if (insertError) {
		throw new Error("担当業務の追加に失敗しました");
	}

	revalidatePath(`/admin/works/${workId}`);
}

/**
 * 実績の使用技術を更新
 */
export async function updateWorkTechnologies(
	workId: string,
	technologyIds: string[],
) {
	const supabase = await createClient();

	// 既存の使用技術を削除
	const { error: deleteError } = await supabase
		.from("work_technologies")
		.delete()
		.eq("work_id", workId);

	if (deleteError) {
		throw new Error("使用技術の削除に失敗しました");
	}

	// 新しい使用技術を追加
	const { error: insertError } = await supabase
		.from("work_technologies")
		.insert(
			technologyIds.map((technologyId) => ({
				work_id: workId,
				technology_id: technologyId,
				created_at: new Date().toISOString(),
			})),
		);

	if (insertError) {
		throw new Error("使用技術の追加に失敗しました");
	}

	revalidatePath(`/admin/works/${workId}`);
}

/**
 * 実績を新規作成
 */
export async function createWork(data: Partial<Work>) {
	const supabase = await createClient();

	const { data: work, error } = await supabase
		.from("works")
		.insert({
			title: data.title || "",
			slug: data.slug || "",
			description: data.description || "",
			thumbnail_url: data.thumbnail_url || "",
			category: data.category || "company",
			status: data.status || "draft",
			github_url: data.github_url,
			website_url: data.website_url,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error("実績の作成に失敗しました");
	}

	revalidatePath("/admin/works");

	return work;
}
