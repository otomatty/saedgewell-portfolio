import type { Database } from "@/types/supabase";

export type Tables = Database["public"]["Tables"];
export type Category = Tables["categories"]["Row"];
export type Chat = Tables["chats"]["Row"] & {
	messages: ChatMessage[];
};
export type ChatMessage = Tables["chat_messages"]["Row"];
export type Faq = Tables["faqs"]["Row"];
export type File = Tables["files"]["Row"];
