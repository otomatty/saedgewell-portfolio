"use server";

import { createClient } from "../lib/supabase/server";
import { cache } from "react";

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

		// 現在のセッション情報をログ
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (!user) {
			console.log("No user session found");
			return false;
		}

		// RPCの実行と結果のログ
		const { data, error } = await supabase.rpc("check_is_admin");

		if (error) {
			console.error("Error checking admin status:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
			});
			return false;
		}

		return data;
	} catch (error) {
		console.error("Unexpected error in isAdmin:", error);
		return false;
	}
});

/**
 * 管理者一覧を取得します
 */
export async function getAdminUsers() {
	try {
		const supabase = await createClient();

		// セッション情報のログ
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data, error } = await supabase.rpc("get_admin_users");

		if (error) {
			console.error("Error in getAdminUsers:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
			});
			throw new Error(`管理者一覧の取得に失敗しました: ${error.message}`);
		}

		return data;
	} catch (error) {
		console.error("Unexpected error in getAdminUsers:", error);
		throw error;
	}
}

/**
 * 管理者を追加します
 * @param userId 追加する管理者のユーザーID
 */
export async function addAdmin(userId: string) {
	try {
		const supabase = await createClient();

		// セッション情報のログ
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { error } = await supabase.rpc("add_admin_user", {
			target_user_id: userId,
		});

		if (error) {
			console.error("Error in addAdmin:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
			});
			throw new Error(`管理者の追加に失敗しました: ${error.message}`);
		}
	} catch (error) {
		console.error("Unexpected error in addAdmin:", error);
		throw error;
	}
}

/**
 * 管理者を削除します
 * @param userId 削除する管理者のユーザーID
 */
export async function removeAdmin(userId: string) {
	try {
		const supabase = await createClient();

		// セッション情報のログ
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { error } = await supabase.rpc("remove_admin_user", {
			target_user_id: userId,
		});

		if (error) {
			console.error("Error in removeAdmin:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
			});
			throw new Error(`管理者の削除に失敗しました: ${error.message}`);
		}

		console.log("Successfully removed admin:", { targetUserId: userId });
	} catch (error) {
		console.error("Unexpected error in removeAdmin:", error);
		throw error;
	}
}

/**
 * 管理者ページへのアクセスを制御します
 * @throws {Error} 管理者権限がない場合
 */
export async function requireAdmin() {
	const isUserAdmin = await isAdmin();

	if (!isUserAdmin) {
		console.log("Access denied: User is not an admin");
		throw new Error("管理者権限がありません");
	}
}
