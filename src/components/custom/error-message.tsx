"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorMessageProps {
	title?: string;
	description: string;
}

/**
 * エラーメッセージを表示するコンポーネント
 */
export function ErrorMessage({
	title = "エラーが発生しました",
	description,
}: ErrorMessageProps) {
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
