import type { Database } from "./supabase";

export type Tables = Database["public"]["Tables"];
export type Category = Tables["contact_categories"]["Row"];
export type Chat = Tables["contact_chats"]["Row"] & {
	messages: ChatMessage[];
};
export type ChatMessage = Tables["contact_chat_messages"]["Row"];
export type Faq = Tables["faqs"]["Row"];
export type File = Tables["files"]["Row"];
