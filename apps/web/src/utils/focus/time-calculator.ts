import type { FocusSession } from "../../types/focus";

/**
 * 今日のフォーカス時間を計算する
 * @param sessions フォーカスセッションの配列
 * @returns 合計フォーカス時間（秒）
 */
export function calculateTodaysFocusTime(sessions: FocusSession[]): number {
	return sessions.reduce((total, session) => {
		if (session.ended_at) {
			return (
				total +
				(new Date(session.ended_at).getTime() -
					new Date(session.started_at).getTime()) /
					1000
			);
		}
		return total;
	}, 0);
}
