"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../../types/supabase";
import { getSupabaseConfig } from "./config";

export async function createClient() {
	const config = getSupabaseConfig();
	const cookieStore = await cookies();

	if (!config.url || !config.anonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	return createServerClient<Database>(config.url, config.anonKey, {
		cookies: {
			getAll() {
				return Array.from(cookieStore.getAll()).map(({ name, value }) => ({
					name,
					value,
				}));
			},
			setAll(cookies) {
				try {
					for (const { name, value, ...options } of cookies) {
						cookieStore.set({ name, value, ...options });
					}
				} catch (error) {
					// Handle or log error if needed
				}
			},
		},
	});
}

// グローバルインスタンスは作成しない
// export const supabase = createClient();
