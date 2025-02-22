"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileWithRole } from "@/types/profile";
import type { UserRole } from "@/types/auth";
/**
 * トップページで使用するプロファイルを取得します
 * (プロファイルが存在しない場合は作成する処理付き)
 * @returns プロファイル情報
 */
export async function getProfileOnTop(): Promise<ProfileWithRole | null> {
	try {
		const supabase = await createClient();

		// ユーザー情報の取得
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		// 未ログイン状態の場合は静かにnullを返す
		if (userError?.message === "Auth session missing!") {
			return null;
		}

		// その他のエラーの場合はログを出力
		if (userError || !user) {
			console.error("[getCurrentUserProfile] User Error:", userError);
			return null;
		}

		// プロファイル情報の取得
		let { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select()
			.eq("id", user.id)
			.single();

		// プロファイルが存在しない場合は作成
		if (profileError?.code === "PGRST116") {
			const { data: newProfile, error: createError } = await supabase
				.from("profiles")
				.insert({
					id: user.id,
					email: user.email ?? "",
					full_name: user.user_metadata?.full_name ?? null,
					avatar_url: user.user_metadata?.avatar_url ?? null,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (createError) {
				console.error(
					"[getCurrentUserProfile] Create Profile Error:",
					createError,
				);
				return null;
			}

			profile = newProfile;

			// デフォルトのユーザーロールを作成
			const { data: defaultRole } = await supabase
				.from("roles")
				.select()
				.eq("name", "user")
				.single();

			if (defaultRole) {
				await supabase.from("user_roles").insert({
					user_id: user.id,
					role_id: defaultRole.id,
				});
			}
		} else if (profileError) {
			console.error("[getCurrentUserProfile] Profile Error:", profileError);
			return null;
		}

		// ロール情報の取得
		const { data: roleData } = await supabase
			.from("user_roles")
			.select(`
				roles (
					name
				)
			`)
			.eq("user_id", user.id)
			.single();

		return {
			id: profile?.id ?? "",
			email: profile?.email ?? "",
			fullName: profile?.full_name ?? "",
			avatarUrl: profile?.avatar_url ?? "",
			createdAt: profile?.created_at ?? "",
			updatedAt: profile?.updated_at ?? "",
			role: roleData?.roles?.name as UserRole,
		};
	} catch (error) {
		console.error("[getCurrentUserProfile] Unexpected Error:", error);
		return null;
	}
}

/**
 * プロファイル情報を取得します
 * @returns プロファイル情報
 */
export async function getProfile(): Promise<Profile | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select()
		.eq("id", user.id)
		.single();

	if (profileError) {
		console.error("[getProfile] Profile Error:", profileError);
		return null;
	}

	// ロール情報の取得
	const { data: roleData } = await supabase
		.from("user_roles")
		.select(`
			roles (
				name
			)
		`)
		.eq("user_id", user.id)
		.single();

	return {
		id: profile?.id ?? "",
		email: profile?.email ?? "",
		fullName: profile?.full_name ?? "",
		avatarUrl: profile?.avatar_url ?? "",
		createdAt: profile?.created_at ?? "",
		updatedAt: profile?.updated_at ?? "",
		role: roleData?.roles?.name as UserRole,
	};
}
