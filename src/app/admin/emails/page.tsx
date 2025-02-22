import { Suspense } from "react";
import { EmailList } from "./_components/email-list";
import { EmailListSkeleton } from "./_components/email-list-skeleton";
import { GmailAuthButton } from "@/components/custom/gmail/auth-button";
import { getEmails } from "@/_actions/gmail";
import { syncEmails } from "@/lib/gmail/service";
import { createClient } from "@/lib/supabase/server";

export default async function EmailsPage() {
	const supabase = await createClient();

	// 最後の同期から5分以上経過している場合のみ同期を実行
	const { data: lastSync } = await supabase
		.from("email_settings")
		.select("last_sync_at")
		.single();

	const lastSyncTime = lastSync?.last_sync_at
		? new Date(lastSync.last_sync_at)
		: null;
	const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

	if (!lastSyncTime || lastSyncTime < fiveMinutesAgo) {
		await syncEmails();
	}

	// 同期したメールを取得
	const result = await getEmails();
	const { emails } = result;

	return (
		<div className="container py-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">メール管理</h1>
				<GmailAuthButton />
			</div>
			<Suspense fallback={<EmailListSkeleton />}>
				<EmailList emails={emails} />
			</Suspense>
		</div>
	);
}
