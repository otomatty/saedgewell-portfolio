import { NextResponse } from "next/server";
import { generateAuthUrl } from "../../../../lib/gmail/auth";

/**
 * Gmail認証ページへのリダイレクトを行うAPI
 */
export async function GET() {
	try {
		// 認証URLを生成
		const authUrl = generateAuthUrl();

		// 認証ページへリダイレクト
		return NextResponse.redirect(authUrl);
	} catch (error) {
		console.error("Failed to generate auth URL:", error);
		return NextResponse.json(
			{ error: "認証URLの生成に失敗しました" },
			{ status: 500 },
		);
	}
}
