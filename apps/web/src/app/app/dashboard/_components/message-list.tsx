"use client";
import Link from "next/link";
import { Card } from "../../../../components/ui/card";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { CalendarDays, MessageCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Message } from "../../../../types/dashboard";

interface MessageListProps {
	messages: Message[];
	nextMeeting?: {
		date: string;
		title: string;
		description: string;
	};
	unreadCount: number;
}

/**
 * メッセージリストコンポーネント
 */
export function MessageList({
	messages,
	nextMeeting,
	unreadCount,
}: MessageListProps) {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("");
	};

	const latestMessage = messages[0];

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold">コミュニケーション</h3>
					<p className="text-sm text-muted-foreground mt-1">
						クライアントとの最新のコミュニケーション状況
					</p>
				</div>
				{unreadCount > 0 && (
					<Badge variant="destructive" className="rounded-full">
						未読 {unreadCount}件
					</Badge>
				)}
			</div>

			<div className="space-y-6">
				{/* 最新のメッセージ */}
				{latestMessage && (
					<div>
						<h4 className="text-sm font-medium mb-3">最新のメッセージ</h4>
						<div className="flex gap-4 rounded-lg border bg-card/50 p-4">
							<Avatar>
								{latestMessage.userAvatar ? (
									<AvatarImage
										src={latestMessage.userAvatar}
										alt={latestMessage.userName}
									/>
								) : (
									<AvatarFallback>
										{getInitials(latestMessage.userName)}
									</AvatarFallback>
								)}
							</Avatar>
							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium">
										{latestMessage.userName}
									</p>
									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(latestMessage.createdAt), {
											addSuffix: true,
											locale: ja,
										})}
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{latestMessage.content}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* 次回ミーティング */}
				{nextMeeting && (
					<div>
						<h4 className="text-sm font-medium mb-3">次回ミーティング</h4>
						<div className="rounded-lg border bg-card/50 p-4">
							<div className="flex items-start gap-4">
								<CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="space-y-1">
									<p className="font-medium">{nextMeeting.title}</p>
									<p className="text-sm text-muted-foreground">
										{nextMeeting.description}
									</p>
									<p className="text-sm font-medium text-primary">
										{format(new Date(nextMeeting.date), "M月d日(E) HH:mm", {
											locale: ja,
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* メッセージ一覧を見るボタン */}
				<Button variant="outline" className="w-full" asChild>
					<Link href="/messages">
						<MessageCircle className="h-4 w-4 mr-2" />
						すべてのメッセージを確認
					</Link>
				</Button>
			</div>
		</Card>
	);
}
