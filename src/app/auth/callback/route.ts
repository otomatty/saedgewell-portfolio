import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");

	if (code) {
		const cookieStore = cookies();
		const supabase = await createClient();

		// codeを使用してセッションを交換
		const {
			data: { session },
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (!error && session?.user) {
			// ユーザー情報を取得
			const { user } = session;
			const email = user.email ?? "";
			const fullName =
				user.user_metadata.full_name ?? user.user_metadata.name ?? null;
			const avatarUrl = user.user_metadata.avatar_url ?? null;

			// プロファイルとユーザーロールを作成/更新
			const { error: profileError } = await supabase.rpc("handle_new_user", {
				p_user_id: user.id,
				p_email: email,
				p_full_name: fullName,
				p_avatar_url: avatarUrl,
			});

			if (profileError) {
				console.error("Profile creation error:", profileError);
			}

			// 認証成功後、ホームページにリダイレクト
			return NextResponse.redirect(new URL("/", requestUrl.origin));
		}
	}

	// エラーが発生した場合はログインページにリダイレクト
	return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
