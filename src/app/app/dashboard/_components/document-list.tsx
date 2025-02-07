"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	FileText,
	FileSpreadsheet,
	Presentation,
	ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { Document } from "@/types/dashboard";

interface DocumentListProps {
	documents: Document[];
}

/**
 * ドキュメントリストコンポーネント
 */
export function DocumentList({ documents }: DocumentListProps) {
	const getStatusColor = (status: Document["status"]) => {
		const colors = {
			draft: "bg-yellow-500",
			review: "bg-blue-500",
			approved: "bg-green-500",
		};
		return colors[status];
	};

	const getStatusText = (status: Document["status"]) => {
		const texts = {
			draft: "下書き",
			review: "レビュー中",
			approved: "承認済み",
		};
		return texts[status];
	};

	const getTypeIcon = (type: Document["type"]) => {
		const icons = {
			document: <FileText className="h-4 w-4" />,
			spreadsheet: <FileSpreadsheet className="h-4 w-4" />,
			presentation: <Presentation className="h-4 w-4" />,
		};
		return icons[type];
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("");
	};

	const displayDocuments = documents.slice(0, 3);
	const hasMore = documents.length > 3;

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold">重要なドキュメント</h3>
					<p className="text-sm text-muted-foreground mt-1">
						プロジェクトの重要な文書を確認できます
					</p>
				</div>
			</div>
			<div className="space-y-4">
				{displayDocuments.map((document) => (
					<div
						key={document.id}
						className="flex items-start gap-4 rounded-lg border bg-card/50 p-4 hover:bg-card/75 transition-colors"
					>
						<div className="mt-1">{getTypeIcon(document.type)}</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-start justify-between">
								<div>
									<h4 className="font-medium">{document.title}</h4>
									<p className="text-sm text-muted-foreground">
										{document.description}
									</p>
								</div>
								<Badge className={getStatusColor(document.status)}>
									{getStatusText(document.status)}
								</Badge>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Avatar className="h-6 w-6">
									{document.updatedBy.avatar ? (
										<AvatarImage
											src={document.updatedBy.avatar}
											alt={document.updatedBy.name}
										/>
									) : (
										<AvatarFallback>
											{getInitials(document.updatedBy.name)}
										</AvatarFallback>
									)}
								</Avatar>
								<span>{document.updatedBy.name}</span>
								<span>•</span>
								<span>
									{formatDistanceToNow(new Date(document.updatedAt), {
										addSuffix: true,
										locale: ja,
									})}
								</span>
							</div>
						</div>
					</div>
				))}

				{hasMore && (
					<Button variant="outline" className="w-full" asChild>
						<Link href="/documents">
							すべてのドキュメントを確認
							<ChevronRight className="h-4 w-4 ml-2" />
						</Link>
					</Button>
				)}
			</div>
		</Card>
	);
}
