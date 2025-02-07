"use client";

import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function NavUser({ user }: { user: User }) {
	const router = useRouter();
	const supabase = createClient();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/auth/login");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center space-x-2">
				<Avatar>
					<AvatarImage src={user.user_metadata.avatar_url} />
					<AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col space-y-1">
					<p className="text-sm font-medium leading-none">
						{user.user_metadata.full_name || user.email}
					</p>
					<p className="text-xs leading-none text-muted-foreground">
						{user.email}
					</p>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>アカウント</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/settings/profile")}>
					プロフィール設定
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push("/settings/security")}>
					セキュリティ設定
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>ログアウト</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
