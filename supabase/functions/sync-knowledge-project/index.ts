import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

interface ScrapboxApiConfig {
	cookie?: string;
	baseUrl?: string;
}

class ScrapboxClient {
	private readonly baseUrl: string;
	private readonly cookie?: string;

	constructor(config?: ScrapboxApiConfig) {
		this.baseUrl = config?.baseUrl ?? "https://scrapbox.io/api";
		this.cookie = config?.cookie;
	}

	private async fetch<T>(path: string): Promise<T> {
		const headers: HeadersInit = {};
		if (this.cookie) {
			headers.Cookie = this.cookie;
		}

		const response = await fetch(`${this.baseUrl}${path}`, {
			headers,
		});

		if (!response.ok) {
			throw new Error(
				`Scrapbox API error: ${response.status} ${response.statusText}`,
			);
		}

		return response.json();
	}

	async getAllPages(projectName: string) {
		const response = await this.fetch<{
			pages: Array<{
				id: string;
				title: string;
				views: number;
				linked: number;
				pin: number;
				updated: number;
			}>;
		}>(`/pages/${projectName}`);

		return response.pages;
	}
}

interface SyncRequest {
	project_id: string;
	project_name: string;
	scrapbox_cookie: string;
	is_private: boolean;
}

serve(async (req) => {
	try {
		const { project_id, project_name, scrapbox_cookie, is_private } =
			(await req.json()) as SyncRequest;

		if (!project_id || !project_name || !scrapbox_cookie) {
			throw new Error("必要なパラメータが不足しています");
		}

		// Scrapboxからデータを取得
		const client = new ScrapboxClient({ cookie: scrapbox_cookie });
		const pages = await client.getAllPages(project_name);

		// Supabaseクライアントの初期化
		const supabaseUrl = Deno.env.get("SUPABASE_URL");
		const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

		if (!supabaseUrl || !supabaseKey) {
			throw new Error("Supabaseの環境変数が設定されていません");
		}

		const supabase = createClient(supabaseUrl, supabaseKey);

		// ページ情報の更新
		let updatedCount = 0;
		for (const page of pages) {
			// 既存のページを確認
			const { data: existingPage } = await supabase
				.from("knowledge_pages")
				.select("updated_at")
				.eq("project_id", project_id)
				.eq("scrapbox_id", page.id)
				.single();

			// 新規ページまたは更新が必要なページの場合
			if (
				!existingPage ||
				new Date(existingPage.updated_at) < new Date(page.updated)
			) {
				await supabase.from("knowledge_pages").upsert({
					project_id,
					scrapbox_id: page.id,
					title: page.title,
					views: Number(page.views),
					linked_count: Number(page.linked),
					pin_status: page.pin,
					updated_at: new Date(page.updated).toISOString(),
					created_at: new Date().toISOString(),
				});
				updatedCount++;
			}
		}

		// 同期ログの更新
		const { error: logError } = await supabase
			.from("knowledge_sync_logs")
			.update({
				pages_processed: pages.length,
				pages_updated: updatedCount,
			})
			.eq("project_id", project_id)
			.eq("status", "processing");

		if (logError) {
			throw new Error(`同期ログの更新に失敗しました: ${logError.message}`);
		}

		return new Response(
			JSON.stringify({
				success: true,
				pages_processed: pages.length,
				pages_updated: updatedCount,
			}),
			{ headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error:
					error instanceof Error ? error.message : "不明なエラーが発生しました",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
});
