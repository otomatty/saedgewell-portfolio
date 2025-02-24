import type { UserRole } from "./auth";
import type { Database } from "./supabase";

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

export interface ProfileWithRole extends Profile {
	roles: UserRole[];
	role: UserRole;
}
