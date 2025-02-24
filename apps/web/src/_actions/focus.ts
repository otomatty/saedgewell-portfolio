"use server";

import type {
	FocusSession,
	FocusInterval,
	FocusStatus,
	IntervalType,
} from "../types/focus";
import { startOfDay, endOfDay } from "date-fns";
import { createClient } from "../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils/error-handler";
import { FOCUS_ERROR_MESSAGES } from "../types/error";

/**
 * 現在のユーザーIDを取得する
 * @throws {AppError} ユーザーが認証されていない場合
 */
async function getCurrentUserId(): Promise<string> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) throw error;
		if (!user) throw new Error(FOCUS_ERROR_MESSAGES.UNAUTHORIZED);

		return user.id;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * 新しいフォーカスセッションを開始する
 * @throws {AppError} エラーが発生した場合
 */
export async function startFocusSession(): Promise<FocusSession> {
	try {
		const userId = await getCurrentUserId();
		const supabase = await createClient();
		const { data: session, error } = await supabase
			.from("focus_sessions")
			.insert({
				user_id: userId,
				started_at: new Date().toISOString(),
				status: "in_progress" as const,
			})
			.select()
			.single();

		if (error) throw error;
		if (!session) throw new Error(FOCUS_ERROR_MESSAGES.SESSION_CREATE_FAILED);

		revalidatePath("/admin/focus");
		return session as FocusSession;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * フォーカスセッションを終了する
 * @param sessionId セッションID
 * @throws {AppError} エラーが発生した場合
 */
export async function endFocusSession(
	sessionId: string,
): Promise<FocusSession> {
	try {
		const userId = await getCurrentUserId();
		const supabase = await createClient();

		// セッションの所有者を確認
		const { data: existingSession } = await supabase
			.from("focus_sessions")
			.select("user_id")
			.eq("id", sessionId)
			.single();

		if (!existingSession)
			throw new Error(FOCUS_ERROR_MESSAGES.SESSION_NOT_FOUND);
		if (existingSession.user_id !== userId)
			throw new Error(FOCUS_ERROR_MESSAGES.FORBIDDEN);

		const { data: session, error } = await supabase
			.from("focus_sessions")
			.update({
				ended_at: new Date().toISOString(),
				status: "completed" as const,
			})
			.eq("id", sessionId)
			.select()
			.single();

		if (error) throw error;
		if (!session) throw new Error(FOCUS_ERROR_MESSAGES.SESSION_UPDATE_FAILED);

		revalidatePath("/admin/focus");
		return session as FocusSession;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * 新しいインターバルを開始する
 * @param sessionId セッションID
 * @param intervalType インターバルタイプ
 * @throws {AppError} エラーが発生した場合
 */
export async function startInterval(
	sessionId: string,
	intervalType: IntervalType,
): Promise<FocusInterval> {
	try {
		const userId = await getCurrentUserId();
		const supabase = await createClient();

		// セッションの所有者を確認
		const { data: existingSession } = await supabase
			.from("focus_sessions")
			.select("user_id")
			.eq("id", sessionId)
			.single();

		if (!existingSession)
			throw new Error(FOCUS_ERROR_MESSAGES.SESSION_NOT_FOUND);
		if (existingSession.user_id !== userId)
			throw new Error(FOCUS_ERROR_MESSAGES.FORBIDDEN);

		const { data: interval, error } = await supabase
			.from("focus_intervals")
			.insert({
				session_id: sessionId,
				interval_type: intervalType,
				started_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		if (!interval) throw new Error(FOCUS_ERROR_MESSAGES.INTERVAL_CREATE_FAILED);

		revalidatePath("/admin/focus");
		return interval as FocusInterval;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * インターバルを終了する
 * @param intervalId インターバルID
 * @throws {AppError} エラーが発生した場合
 */
export async function endInterval(intervalId: string): Promise<FocusInterval> {
	try {
		const userId = await getCurrentUserId();
		const supabase = await createClient();

		// インターバルの所有者を確認
		const { data: existingInterval } = await supabase
			.from("focus_intervals")
			.select("focus_sessions!inner(user_id)")
			.eq("id", intervalId)
			.single();

		if (!existingInterval)
			throw new Error(FOCUS_ERROR_MESSAGES.INTERVAL_NOT_FOUND);
		if (existingInterval.focus_sessions.user_id !== userId)
			throw new Error(FOCUS_ERROR_MESSAGES.FORBIDDEN);

		const { data: interval, error } = await supabase
			.from("focus_intervals")
			.update({
				ended_at: new Date().toISOString(),
			})
			.eq("id", intervalId)
			.select()
			.single();

		if (error) throw error;
		if (!interval) throw new Error(FOCUS_ERROR_MESSAGES.INTERVAL_UPDATE_FAILED);

		revalidatePath("/admin/focus");
		return interval as FocusInterval;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * 今日のフォーカスセッションを取得する
 * @throws {AppError} エラーが発生した場合
 */
export async function getTodaysFocusSessions(): Promise<FocusSession[]> {
	try {
		const userId = await getCurrentUserId();
		const supabase = await createClient();
		const today = new Date();
		const { data: sessions, error } = await supabase
			.from("focus_sessions")
			.select("*")
			.eq("user_id", userId)
			.gte("started_at", startOfDay(today).toISOString())
			.lte("started_at", endOfDay(today).toISOString())
			.order("started_at", { ascending: false });

		if (error) throw error;
		return (sessions || []) as FocusSession[];
	} catch (error) {
		throw handleError(error);
	}
}
