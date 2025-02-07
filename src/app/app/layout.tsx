import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthProvider } from "./_components/AuthProvider";
import { AuthHeader } from "./_components/AuthHeader";
import { AuthSidebar } from "./_components/AuthSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	return (
		<AuthProvider>
			<SidebarProvider>
				<AuthSidebar user={user} />
				<SidebarInset>
					<AuthHeader />
					<main className="container py-8">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</AuthProvider>
	);
}
