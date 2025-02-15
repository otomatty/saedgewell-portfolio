"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/auth";

/**
 * OAuth認証（Google）を実行します
 */
export async function signInWithGoogle() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
		},
	});

	if (error) {
		throw error;
	}

	if (data.url) {
		redirect(data.url);
	}
}

/**
 * OAuth認証（GitHub）を実行します
 */
export async function signInWithGithub() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
		},
	});

	if (error) {
		throw error;
	}

	if (data.url) {
		redirect(data.url);
	}
}

/**
 * サインアウトを実行します
 */
export async function signOut() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw error;
	}

	revalidatePath("/", "layout");
	redirect("/");
}

/**
 * 現在のユーザーのロールを取得します
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("roles (name)")
		.eq("id", user.id)
		.single();

	return (profile?.roles?.[0]?.name as UserRole) ?? "user";
}

/**
 * ユーザープロフィールを作成または更新します
 */
export async function upsertProfile(userId: string, email: string) {
	const supabase = await createClient();

	// トランザクションを開始
	const { error: transactionError } = await supabase.rpc("handle_new_user", {
		p_user_id: userId,
		p_email: email,
	});

	if (transactionError) {
		throw transactionError;
	}

	revalidatePath("/", "layout");
}

/**
 * 現在のユーザーが管理者かどうかを確認します
 */
export async function checkIsAdmin(): Promise<boolean> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return false;
	}

	// サーバーサイドでロールを確認
	const { data: adminRole } = await supabase.rpc("check_is_admin", {
		p_user_id: user.id,
	});

	return !!adminRole;
}
