import { type NextRequest, NextResponse } from "next/server";
import { getTokenFromCode } from "@/lib/gmail/auth";

/**
 * Gmail認証のコールバックを処理するAPI
 */
export async function GET(request: NextRequest) {
	try {
		// URLからcodeパラメータを取得
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");

		if (!code) {
			return NextResponse.json(
				{ error: "認証コードが見つかりません" },
				{ status: 400 },
			);
		}

		// 認証コードからトークンを取得
		await getTokenFromCode(code);

		// 認証成功後のリダイレクト
		return NextResponse.redirect(new URL("/admin/emails", request.url));
	} catch (error) {
		console.error("Failed to handle auth callback:", error);
		return NextResponse.json(
			{ error: "認証処理に失敗しました" },
			{ status: 500 },
		);
	}
}
