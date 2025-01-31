"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Estimate = Database["public"]["Tables"]["estimates"]["Row"];
type EstimateFeature = Database["public"]["Tables"]["estimate_features"]["Row"];
type EstimateRequirement =
	Database["public"]["Tables"]["estimate_requirements"]["Row"];

/**
 * お問い合わせを作成
 */
export async function createContact(
	contact: Omit<Contact, "id" | "created_at" | "updated_at">,
) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("contacts")
		.insert([contact])
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create contact: ${error.message}`);
	}

	return data;
}

/**
 * 見積もりを作成
 */
export async function createEstimate(
	estimate: Omit<Estimate, "id" | "created_at" | "updated_at">,
	features: Omit<
		EstimateFeature,
		"id" | "estimate_id" | "created_at" | "updated_at"
	>[],
	requirements: Omit<
		EstimateRequirement,
		"id" | "estimate_id" | "created_at" | "updated_at"
	>,
) {
	const supabase = await createClient();

	// トランザクションを開始
	const { data: estimateData, error: estimateError } = await supabase
		.from("estimates")
		.insert([estimate])
		.select()
		.single();

	if (estimateError) {
		throw new Error(`Failed to create estimate: ${estimateError.message}`);
	}

	// 見積もりの機能を作成
	const { error: featuresError } = await supabase
		.from("estimate_features")
		.insert(
			features.map((feature) => ({
				...feature,
				estimate_id: estimateData.id,
			})),
		);

	if (featuresError) {
		throw new Error(
			`Failed to create estimate features: ${featuresError.message}`,
		);
	}

	// 見積もりの要件を作成
	const { error: requirementsError } = await supabase
		.from("estimate_requirements")
		.insert([
			{
				...requirements,
				estimate_id: estimateData.id,
			},
		]);

	if (requirementsError) {
		throw new Error(
			`Failed to create estimate requirements: ${requirementsError.message}`,
		);
	}

	return estimateData;
}

/**
 * 見積もりを取得
 */
export async function getEstimate(id: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("estimates")
		.select(`
      *,
      contacts(*),
      estimate_features(*),
      estimate_requirements(*)
    `)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`Failed to fetch estimate: ${error.message}`);
	}

	return data;
}
