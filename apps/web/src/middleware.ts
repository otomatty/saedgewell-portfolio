import { createClient } from "./lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "./types/supabase";

const THEME_COOKIE_NAME = "theme";

export async function middleware(request: NextRequest) {
	const res = NextResponse.next();
	const supabase = await createClient();

	// テーマの設定を取得
	const themeCookie = request.cookies.get(THEME_COOKIE_NAME);
	const theme = themeCookie?.value || "system";

	// HTMLのclassを設定
	if (theme === "dark") {
		res.headers.set("Set-Cookie", `${THEME_COOKIE_NAME}=dark; path=/`);
	} else if (theme === "light") {
		res.headers.set("Set-Cookie", `${THEME_COOKIE_NAME}=light; path=/`);
	} else {
		res.headers.set("Set-Cookie", `${THEME_COOKIE_NAME}=system; path=/`);
	}

	// セッションの取得
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// サイト設定の取得
	const { data: settings } = await supabase
		.from("site_settings")
		.select("*")
		.single();

	// メンテナンスモードの確認
	if (settings?.maintenance_mode) {
		// 管理者以外はメンテナンスページにリダイレクト
		const isAdmin = user?.user_metadata.role === "admin";
		const isMaintenance = request.nextUrl.pathname === "/maintenance";

		if (!isAdmin && !isMaintenance) {
			return NextResponse.redirect(new URL("/maintenance", request.url));
		}

		if (isAdmin && isMaintenance) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// 機能の有効/無効の確認
	const path = request.nextUrl.pathname;
	if (
		(path.startsWith("/blog") && !settings?.enable_blog) ||
		(path.startsWith("/works") && !settings?.enable_works) ||
		(path.startsWith("/contact") && !settings?.enable_contact) ||
		(path.startsWith("/services/estimate") && !settings?.enable_estimate)
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return res;
}

export const config = {
	matcher: [
		/*
		 * すべてのパスに対してミドルウェアを適用
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
