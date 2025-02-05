import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/auth";

export function useAuthorization() {
	const { role } = useAuth();

	const isAdmin = role === "admin";
	const isClient = role === "client";
	const isUser = role === "user";

	const hasRole = (requiredRole: UserRole) => {
		if (!role) return false;

		switch (requiredRole) {
			case "admin":
				return isAdmin;
			case "client":
				return isAdmin || isClient;
			case "user":
				return isAdmin || isClient || isUser;
			default:
				return false;
		}
	};

	return {
		isAdmin,
		isClient,
		isUser,
		hasRole,
	};
}
