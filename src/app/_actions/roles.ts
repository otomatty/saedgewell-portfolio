"use server";

import { createClient } from "@/lib/supabase/server";
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
		.eq("user_roles.user_id", userId);

	return roles?.map((r) => r.name) ?? [];
});

/**
 * 管理者ロールを持っているかチェックします
 */
export async function isAdmin(): Promise<boolean> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return false;

	const roles = await getUserRoles(user.id);
	return roles.includes("admin");
}

/**
 * 管理者ページへのアクセスを制御します
 */
export async function requireAdmin() {
	const isUserAdmin = await isAdmin();

	if (!isUserAdmin) {
		redirect("/");
	}
}
