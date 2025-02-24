"use client";

import { Button } from "../ui/button";
import { ResponsiveDialog } from "./responsive-dialog";
import { LoginForm } from "./login-form";

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
