import type {
	ProjectResponse,
	ScrapboxApiConfig,
	ScrapboxPage,
} from "@/types/scrapbox";

/**
 * Scrapbox APIクライアント
 * @description Scrapboxのプロジェクトとページ一覧を取得するためのクライアント
 */
export class ScrapboxClient {
	private readonly baseUrl: string;
	private readonly cookie?: string;

	constructor(config?: ScrapboxApiConfig) {
		this.baseUrl = config?.baseUrl ?? "https://scrapbox.io/api";
		this.cookie = config?.cookie;
	}

	/**
	 * プロジェクトの全ページを取得する
	 * @param projectName プロジェクト名
	 * @returns プロジェクトの全ページ
	 */
	async getAllPages(projectName: string): Promise<ScrapboxPage[]> {
		const limit = 100;
		let skip = 0;
		let allPages: ScrapboxPage[] = [];
		let hasMore = true;

		while (hasMore) {
			const response = await this.getPages(projectName, { skip, limit });
			allPages = [...allPages, ...response.pages];
			skip += limit;
			hasMore = response.pages.length === limit;
		}

		return allPages;
	}

	/**
	 * プロジェクトのページ一覧を取得する
	 * @param projectName プロジェクト名
	 * @param params 取得パラメータ
	 * @returns プロジェクトのページ一覧
	 */
	private async getPages(
		projectName: string,
		params: { skip: number; limit: number },
	): Promise<ProjectResponse> {
		const url = new URL(`${this.baseUrl}/pages/${projectName}`);
		url.searchParams.set("skip", params.skip.toString());
		url.searchParams.set("limit", params.limit.toString());

		if (!this.cookie) {
			throw new Error("Scrapboxの認証情報（cookie）が設定されていません。");
		}

		const headers: HeadersInit = {
			"Content-Type": "application/json",
			Cookie: this.cookie,
		};

		const response = await fetch(url.toString(), {
			method: "GET",
			headers,
			credentials: "include",
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error(
					"Scrapboxの認証に失敗しました。cookieを確認してください。",
				);
			}
			if (response.status === 404) {
				throw new Error(`プロジェクト「${projectName}」が見つかりません。`);
			}
			throw new Error(`Failed to fetch pages: ${response.statusText}`);
		}

		return response.json();
	}
}
