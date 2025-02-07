import type { Database } from "./supabase";

// データベースの型定義から各テーブルの型を取得
type WorkRow = Database["public"]["Tables"]["works"]["Row"];
type WorkDetailRow = Database["public"]["Tables"]["work_details"]["Row"];
type WorkImageRow = Database["public"]["Tables"]["work_images"]["Row"];
type WorkResponsibilityRow =
	Database["public"]["Tables"]["work_responsibilities"]["Row"];
type WorkChallengeRow = Database["public"]["Tables"]["work_challenges"]["Row"];
type WorkSolutionRow = Database["public"]["Tables"]["work_solutions"]["Row"];
type WorkResultRow = Database["public"]["Tables"]["work_results"]["Row"];
type WorkTechnologyRow =
	Database["public"]["Tables"]["work_technologies"]["Row"];
type TechnologyRow = Database["public"]["Tables"]["technologies"]["Row"];

// 実績のステータス
export type WorkStatus = WorkRow["status"];

// 実績のカテゴリー
export type WorkCategory = WorkRow["category"];

// 実績の基本情報
export type Work = {
	id: string;
	title: string;
	slug: string;
	description: string;
	thumbnail_url: string;
	github_url: string | null;
	website_url: string | null;
	category: "company" | "freelance" | "personal";
	status: "draft" | "published" | "archived";
	created_at: string | null;
	updated_at: string | null;
	work_details: Database["public"]["Tables"]["work_details"]["Row"][];
	work_images: Database["public"]["Tables"]["work_images"]["Row"][];
	work_responsibilities: Database["public"]["Tables"]["work_responsibilities"]["Row"][];
	work_challenges: Database["public"]["Tables"]["work_challenges"]["Row"][];
	work_solutions: Database["public"]["Tables"]["work_solutions"]["Row"][];
	work_results: Database["public"]["Tables"]["work_results"]["Row"][];
	work_technologies: {
		technologies: Database["public"]["Tables"]["technologies"]["Row"];
	}[];
};

// 実績の詳細情報
export type WorkDetail = {
	id: string;
	work_id: string;
	overview: string;
	role: string;
	period: string;
	team_size: string;
	created_at: string;
	updated_at: string;
};

// 実績の画像
export type WorkImage = {
	id: string;
	work_id: string;
	url: string;
	alt: string;
	caption: string | null;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

// 実績の担当業務
export type WorkResponsibility = {
	id: string;
	work_id: string;
	description: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

// 実績の課題
export type WorkChallenge = {
	id: string;
	work_id: string;
	title: string;
	description: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

// 実績の解決策
export type WorkSolution = {
	id: string;
	work_id: string;
	challenge_id: string | null;
	title: string;
	description: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

// 実績の成果
export type WorkResult = {
	id: string;
	work_id: string;
	description: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

// 技術スタック
export type Technology = {
	id: string;
	name: string;
	description: string | null;
	category: string;
	icon_url: string | null;
	created_at: string;
	updated_at: string;
};

// フィルター用の型
export interface WorksFilter {
	status?: string;
	category?: string;
	query?: string;
}

// 実績表示用の型定義
export type FeaturedWork = Pick<
	Work,
	"id" | "title" | "description" | "thumbnail_url"
>;
