import { syncProject } from "../../../../_actions/knowledge-sync";
import { NextResponse } from "next/server";

/**
 * 自動同期を実行するAPI
 * Supabaseのcronジョブから呼び出される
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const projectId = body.project_id;

		if (!projectId) {
			return NextResponse.json(
				{
					success: false,
					error: "プロジェクトIDが指定されていません。",
				},
				{ status: 400 },
			);
		}

		const result = await syncProject(projectId);
		if (!result.success) {
			throw new Error(result.error);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Failed to run sync:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "不明なエラーが発生しました。",
			},
			{ status: 500 },
		);
	}
}
