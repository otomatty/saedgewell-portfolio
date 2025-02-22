import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/store/auth";
import { createClient } from "@/lib/supabase/client";
import { checkIsAdmin } from "@/_actions/auth";
import type { Profile } from "@/types/profile";

export const useAuth = (initialProfile: Profile | null = null) => {
	const [auth, setAuth] = useAtom(authAtom);
	const [isAdmin, setIsAdmin] = useState(initialProfile?.role === "admin");
	const supabase = createClient();

	// プロファイル情報が存在する場合は認証状態を更新
	useEffect(() => {
		if (initialProfile) {
			setAuth({
				isLoading: false,
				isAuthenticated: true,
				user: {
					id: initialProfile.id,
					email: initialProfile.email,
					app_metadata: {},
					user_metadata: {},
					aud: "authenticated",
					created_at: initialProfile.createdAt,
				},
			});
		}
	}, [initialProfile, setAuth]);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			// セッションの状態を更新
			setAuth({
				isLoading: false,
				isAuthenticated: !!session,
				user: session?.user ?? null,
			});

			// セッションが存在する場合、管理者権限を確認
			if (session?.user) {
				const isAdminUser = await checkIsAdmin();
				setIsAdmin(isAdminUser);
			} else {
				setIsAdmin(false);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase, setAuth]);

	const returnValue = {
		isLoading: auth.isLoading && !initialProfile,
		isAuthenticated: auth.isAuthenticated || !!initialProfile,
		user: auth.user,
		isAdmin,
	};

	return returnValue;
};
