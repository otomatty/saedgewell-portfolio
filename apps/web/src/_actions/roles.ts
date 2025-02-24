"use server";

import { createClient } from "../lib/supabase/server";
import { cache } from "react";
import { redirect } from "next/navigation";

/**
 * ユーザーのロールを取得します
 */
export const getUserRoles = cache(async (userId: string): Promise<string[]> => {
	const supabase = await createClient();

	const { data: roles } = await supabase
		.from("roles")
		.select(`
      name,
      user_roles!inner(
        user_id
      )
    `)
		.eq("user_roles.user_id", userId)
		.neq("name", "admin");

	return roles?.map((r) => r.name) ?? [];
});

/**
 * 管理者権限を確認します
 * @returns {Promise<boolean>} 管理者権限を持っているかどうか
 */
export const isAdmin = cache(async (): Promise<boolean> => {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase.rpc("check_is_admin");

		if (error) {
			console.error("Error checking admin status:", error);
			return false;
		}

		return data;
	} catch (error) {
		console.error("Error checking admin status:", error);
		return false;
	}
});

/**
 * 管理者一覧を取得します
 */
export async function getAdminUsers() {
	const supabase = await createClient();
	const { data, error } = await supabase.rpc("get_admin_users");

	if (error) {
		throw new Error(`管理者一覧の取得に失敗しました: ${error.message}`);
	}

	return data;
}

/**
 * 管理者を追加します
 * @param userId 追加する管理者のユーザーID
 */
export async function addAdmin(userId: string) {
	const supabase = await createClient();
	const { error } = await supabase.rpc("add_admin_user", {
		target_user_id: userId,
	});

	if (error) {
		throw new Error(`管理者の追加に失敗しました: ${error.message}`);
	}
}

/**
 * 管理者を削除します
 * @param userId 削除する管理者のユーザーID
 */
export async function removeAdmin(userId: string) {
	const supabase = await createClient();
	const { error } = await supabase.rpc("remove_admin_user", {
		target_user_id: userId,
	});

	if (error) {
		throw new Error(`管理者の削除に失敗しました: ${error.message}`);
	}
}

/**
 * 管理者ページへのアクセスを制御します
 */
export async function requireAdmin() {
	try {
		const isUserAdmin = await isAdmin();

		if (!isUserAdmin) {
			redirect("/");
		}
	} catch (error) {
		console.error("Error in requireAdmin:", error);
		redirect("/");
	}
}
