"use client";

import { Button } from "@/components/ui/button";
import { useGmailAuth } from "@/hooks/useGmailAuth";
import { Mail } from "lucide-react";

export function GmailAuthButton() {
	const { isAuthenticated, isLoading, error, startAuth } = useGmailAuth();

	if (isLoading) {
		return (
			<Button disabled variant="outline">
				<Mail className="mr-2 h-4 w-4" />
				読み込み中...
			</Button>
		);
	}

	if (isAuthenticated) {
		return (
			<Button variant="outline" className="text-green-600">
				<Mail className="mr-2 h-4 w-4" />
				Gmail連携済み
			</Button>
		);
	}

	return (
		<Button onClick={startAuth} variant="outline">
			<Mail className="mr-2 h-4 w-4" />
			{error ? "再認証" : "Gmailと連携"}
		</Button>
	);
}
