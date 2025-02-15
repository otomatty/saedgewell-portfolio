"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/responsive-dialog";
import { LoginForm } from "@/components/custom/login-form";

export const LoginDialog = () => {
	return (
		<ResponsiveDialog
			trigger={<Button>ログインする</Button>}
			title="ログイン"
			description="ソーシャルアカウントでログインしてください"
			contentClassName="sm:max-w-[400px]"
		>
			<LoginForm />
		</ResponsiveDialog>
	);
};
