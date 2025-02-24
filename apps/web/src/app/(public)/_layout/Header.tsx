"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { MobileSidebar } from "./MobileSidebar";
import { Skeleton } from "../../../components/ui/skeleton";
import { UserMenu } from "./_components/UserMenu";
import { useAuth } from "../../../hooks/useAuth";
import type { ProfileWithRole } from "../../../types/profile";
import { ContactDialog } from "../../../components/custom/contact/contact-dialog";
import { ThemeToggle } from "../../../components/custom/theme/theme-toggle";
import { LoginDialog } from "../../../components/custom/login-dialog";

interface HeaderProps {
	profile: ProfileWithRole | null;
}

export const Header = ({ profile }: HeaderProps) => {
	const { isLoading, isAuthenticated } = useAuth(profile);

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<div className="container flex h-16 items-center">
				<div className="mr-8">
					<Link href="/" className="text-xl font-bold">
						Saedgewell
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-end space-x-4">
					{/* デスクトップ用のナビゲーションとユーザーメニュー */}
					<div className="hidden md:flex md:items-center md:space-x-4">
						<Navigation />
						<ThemeToggle />
						<ContactDialog />
						{isLoading ? (
							<Skeleton className="h-10 w-10 rounded-full" />
						) : isAuthenticated ? (
							profile ? (
								<UserMenu profile={profile} />
							) : (
								<Skeleton className="h-10 w-10 rounded-full" />
							)
						) : (
							<LoginDialog />
						)}
					</div>

					{/* モバイル用のサイドバー */}
					<MobileSidebar profile={profile} />
				</div>
			</div>
		</motion.header>
	);
};
