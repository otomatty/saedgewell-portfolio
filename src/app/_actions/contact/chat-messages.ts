"use server";

import { createClient } from "@/lib/supabase/server";
import type { ChatMessage } from "@/types/contact";
import type { Database } from "@/types/supabase";
type DbResult<T extends keyof Database["public"]["Tables"]> =
	Database["public"]["Tables"][T]["Row"];
type ChatMessageRow = DbResult<"chat_messages">;

/**
 * チャットメッセージを作成する
 */
export async function createChatMessage(
	chatId: string,
	messageText: string,
	senderType: "user" | "assistant" | "admin",
	faqId?: string,
	isEscalationRequest = false,
): Promise<ChatMessage> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chat_messages")
		.insert({
			chat_id: chatId,
			message_text: messageText,
			sender_type: senderType,
			faq_id: faqId,
			is_escalation_request: isEscalationRequest,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating chat message:", error);
		throw new Error("メッセージの送信に失敗しました");
	}

	return data as ChatMessageRow;
}

export async function sendMessage(
	chatId: string,
	messageText: string,
	senderType: "user" | "assistant" | "admin",
	faqId?: string,
	isEscalationRequest = false,
): Promise<ChatMessage> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chat_messages")
		.insert({
			chat_id: chatId,
			message_text: messageText,
			sender_type: senderType,
			faq_id: faqId,
			is_escalation_request: isEscalationRequest,
		})
		.select()
		.single();

	if (error) {
		console.error("Error sending message:", error);
		throw new Error("メッセージの送信に失敗しました");
	}

	return data as ChatMessageRow;
}

/**
 * チャットメッセージ一覧を取得する
 */
export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chat_messages")
		.select(`
      *,
      files (*)
    `)
		.eq("chat_id", chatId)
		.order("timestamp", { ascending: true });

	if (error) {
		console.error("Error fetching chat messages:", error);
		throw new Error("メッセージの取得に失敗しました");
	}

	return (data as ChatMessageRow[]) ?? [];
}

/**
 * チャットメッセージを取得する
 */
export async function getChatMessage(id: string): Promise<ChatMessage | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("chat_messages")
		.select(`
      *,
      files (*)
    `)
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching chat message:", error);
		throw new Error("メッセージの取得に失敗しました");
	}

	return data as ChatMessageRow | null;
}
