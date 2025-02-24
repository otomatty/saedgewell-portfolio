"use server";

import { createClient } from "../lib/supabase/server";
import { cookies } from "next/headers";
import { type Metric, MetricType } from "../types/metrics";
import { revalidatePath } from "next/cache";

// データの取得
export async function getMetrics() {
	const supabase = await createClient();

	const { data: metrics, error } = await supabase
		.from("metrics")
		.select("*")
		.order("sort_order");

	if (error) {
		console.error("Error fetching metrics:", error);
		throw new Error(error.message);
	}

	return metrics as Metric[];
}

// データの作成
export async function createMetric(
	metric: Omit<Metric, "id" | "created_at" | "updated_at">,
) {
	const supabase = await createClient();

	const { error } = await supabase.from("metrics").insert(metric);

	if (error) {
		console.error("Error creating metric:", error);
		throw new Error(error.message);
	}

	revalidatePath("/admin");
}

// データの更新
export async function updateMetric(
	id: string,
	updates: Partial<Omit<Metric, "id" | "created_at" | "updated_at">>,
) {
	const supabase = await createClient();

	const { error } = await supabase.from("metrics").update(updates).eq("id", id);

	if (error) {
		console.error("Error updating metric:", error);
		throw new Error(error.message);
	}

	revalidatePath("/admin");
}

// データの削除
export async function deleteMetric(id: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("metrics").delete().eq("id", id);

	if (error) {
		console.error("Error deleting metric:", error);
		throw new Error(error.message);
	}

	revalidatePath("/admin");
}
