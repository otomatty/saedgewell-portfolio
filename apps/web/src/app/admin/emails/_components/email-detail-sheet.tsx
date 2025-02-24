import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "../../../../components/ui/sheet";
import { Button } from "../../../../components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../../components/ui/tabs";
import { formatDateTime } from "@/utils/format";
import { Reply, Archive, Star, Mail } from "lucide-react";
import { getEmailDetail } from "../../../../_actions/gmail";
import { Suspense } from "react";
import { EmailDetailSkeleton } from "./email-detail-skeleton";
import { EmailDetailContent } from "./email-detail-content";

interface EmailDetailSheetProps {
	emailId: string | null;
	onClose: () => void;
}

export function EmailDetailSheet({ emailId, onClose }: EmailDetailSheetProps) {
	const open = !!emailId;

	return (
		<Sheet open={open} onOpenChange={(open) => !open && onClose()}>
			<SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
				{emailId && (
					<Suspense fallback={<EmailDetailSkeleton />}>
						<EmailDetailContent emailId={emailId} />
					</Suspense>
				)}
			</SheetContent>
		</Sheet>
	);
}
