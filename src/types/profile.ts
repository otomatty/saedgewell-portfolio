import type { UserRole } from "@/types/auth";
import type { Database } from "@/types/supabase";

export type DBProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface Profile {
	id: string;
	email: string;
	fullName: string | null;
	avatarUrl: string | null;
	createdAt: string;
	updatedAt: string;
	role: UserRole;
}

export type ProfileWithRole = Profile;
