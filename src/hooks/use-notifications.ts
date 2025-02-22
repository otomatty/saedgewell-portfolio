import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import {
	notificationsAtom,
	notificationSettingsAtom,
} from "@/store/notification";
import type {
	Notification,
	NotificationSettings,
	UpdateNotificationSettings,
} from "@/types/notification";
import {
	getNotifications,
	getNotificationSettings,
	markNotificationsAsRead,
	updateNotificationSettings as updateSettings,
} from "@/_actions/notifications";

/**
 * 通知関連のカスタムフック
 */
export function useNotifications() {
	const [notifications, setNotifications] = useAtom(notificationsAtom);
	const [settings, setSettings] = useAtom(notificationSettingsAtom);

	/**
	 * 通知一覧を取得
	 */
	const fetchNotifications = useCallback(async () => {
		try {
			const data = await getNotifications();
			setNotifications(data);
		} catch (error) {
			console.error("通知の取得に失敗しました:", error);
		}
	}, [setNotifications]);

	/**
	 * 通知設定を取得
	 */
	const fetchSettings = useCallback(async () => {
		try {
			const data = await getNotificationSettings();
			setSettings({
				id: data.id,
				userId: data.userId,
				projectUpdates: data.projectUpdates ?? false,
				chatMessages: data.chatMessages ?? false,
				milestones: data.milestones ?? false,
				documents: data.documents ?? false,
				systemNotifications: data.systemNotifications ?? false,
				emailNotifications: data.emailNotifications ?? false,
				createdAt: data.createdAt ?? new Date().toISOString(),
				updatedAt: data.updatedAt ?? new Date().toISOString(),
			});
		} catch (error) {
			console.error("通知設定の取得に失敗しました:", error);
		}
	}, [setSettings]);

	/**
	 * 通知を既読にする
	 */
	const markAsRead = useCallback(
		async (notificationIds: string[]) => {
			try {
				await markNotificationsAsRead(notificationIds);
				setNotifications((prev) =>
					prev.map((notification) =>
						notificationIds.includes(notification.id)
							? { ...notification, isRead: true }
							: notification,
					),
				);
			} catch (error) {
				console.error("通知の既読化に失敗しました:", error);
			}
		},
		[setNotifications],
	);

	/**
	 * 通知設定を更新
	 */
	const updateNotificationSettings = useCallback(
		async (newSettings: UpdateNotificationSettings) => {
			try {
				await updateSettings(newSettings);
				setSettings((prev) => {
					if (!prev) return prev;
					return { ...prev, ...newSettings };
				});
			} catch (error) {
				console.error("通知設定の更新に失敗しました:", error);
			}
		},
		[setSettings],
	);

	useEffect(() => {
		fetchNotifications();
		fetchSettings();
	}, [fetchNotifications, fetchSettings]);

	return {
		notifications,
		settings,
		markAsRead,
		updateSettings: updateNotificationSettings,
		refetch: fetchNotifications,
	};
}
