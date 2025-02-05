import { LoginForm } from "./_components/LoginForm";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "ログイン - Saedgewell",
	description: "ソーシャルアカウントでログインしてください。",
};

export default async function LoginPage() {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// すでにログインしている場合はホームにリダイレクト
	if (session) {
		redirect("/");
	}

	return (
		<div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
			<LoginForm />
		</div>
	);
}
