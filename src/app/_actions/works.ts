"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createStaticClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

type Work = Database["public"]["Tables"]["works"]["Row"];
type WorkDetail = Database["public"]["Tables"]["work_details"]["Row"];
type WorkImage = Database["public"]["Tables"]["work_images"]["Row"];
type WorkResponsibility =
	Database["public"]["Tables"]["work_responsibilities"]["Row"];
type WorkChallenge = Database["public"]["Tables"]["work_challenges"]["Row"];
type WorkSolution = Database["public"]["Tables"]["work_solutions"]["Row"];
type WorkResult = Database["public"]["Tables"]["work_results"]["Row"];
type WorkTechnology = Database["public"]["Tables"]["work_technologies"]["Row"];

/**
 * 全ての実績を取得
 */
export async function getWorks() {
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
		.eq("status", "published")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch works: ${error.message}`);
	}

	return data;
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
