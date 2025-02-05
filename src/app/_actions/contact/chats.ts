"use server";

import { createClient } from "@/lib/supabase/server";
import type { Chat, ChatMessage } from "@/types/contact";
import type { Database } from "@/types/supabase";

type DbResult<T extends keyof Database["public"]["Tables"]> =
	Database["public"]["Tables"][T]["Row"];
type ChatRow = DbResult<"chats">;
type ChatWithMessages = ChatRow & { messages: DbResult<"chat_messages">[] };

/**
 * チャットを作成する
 */
export async function createChat(
	categoryId: string,
	profileId: string,
	pageUrl?: string,
): Promise<Chat> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chats")
		.insert({
			category_id: categoryId,
			profile_id: profileId,
			page_url: pageUrl,
			status: "open",
		})
		.select(`
			*,
			messages:chat_messages(*)
		`)
		.single();

	if (error) {
		console.error("Error creating chat:", error);
		throw new Error("チャットの作成に失敗しました");
	}

	return data as ChatWithMessages;
}

/**
 * チャットを取得する
 */
export async function getChat(id: string): Promise<Chat | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chats")
		.select(`
			*,
			messages:chat_messages(*)
		`)
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching chat:", error);
		throw new Error("チャットの取得に失敗しました");
	}

	return data as ChatWithMessages | null;
}

/**
 * チャットのステータスを更新する
 */
export async function updateChatStatus(
	id: string,
	status: "open" | "pending" | "escalated" | "closed",
): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from("chats")
		.update({ status })
		.eq("id", id);

	if (error) {
		console.error("Error updating chat status:", error);
		throw new Error("チャットステータスの更新に失敗しました");
	}
}

/**
 * ユーザーのチャット一覧を取得する
 */
export async function getUserChats(profileId: string): Promise<Chat[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chats")
		.select(`
			*,
			messages:chat_messages(*)
		`)
		.eq("profile_id", profileId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching user chats:", error);
		throw new Error("チャット一覧の取得に失敗しました");
	}

	return (data as ChatWithMessages[]) ?? [];
}
