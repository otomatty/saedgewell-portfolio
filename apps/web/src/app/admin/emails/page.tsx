import { Suspense } from "react";
import { EmailList } from "./_components/email-list";
import { EmailListSkeleton } from "./_components/email-list-skeleton";
import { GmailAuthButton } from "../../../components/custom/gmail/auth-button";
import { getEmails } from "../../../_actions/gmail";
import { syncEmails } from "../../../lib/gmail/service";
import { createClient } from "../../../lib/supabase/server";
import { PageHeader } from "@/components/custom/page-header";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./_components/error-fallback";

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
		<div className="space-y-4">
			<PageHeader title="メール管理" actions={<GmailAuthButton />} />
			<div className="container">
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<Suspense fallback={<EmailListSkeleton />}>
						<EmailList emails={emails} />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	);
}
