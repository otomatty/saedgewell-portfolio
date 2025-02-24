"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { TIMER_SETTINGS, type IntervalType } from "../types/focus";
import {
	startFocusSession,
	endFocusSession,
	startInterval,
	endInterval,
} from "../_actions/focus";
import { useErrorHandler } from "./use-error-handler";

export function useFocusTimer() {
	const [time, setTime] = useState(TIMER_SETTINGS.focusDuration);
	const [totalTime, setTotalTime] = useState(TIMER_SETTINGS.focusDuration);
	const [intervalType, setIntervalType] = useState<IntervalType>("focus");
	const [isRunning, setIsRunning] = useState(false);
	const [completedIntervals, setCompletedIntervals] = useState(0);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [currentIntervalId, setCurrentIntervalId] = useState<string | null>(
		null,
	);
	const { handleError } = useErrorHandler();
	const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
		undefined,
	);
	const audioRef = useRef<HTMLAudioElement | undefined>(undefined);
	const sessionRef = useRef<{ id: string; intervalId: string } | null>(null);

	// 通知の初期化
	useEffect(() => {
		// 通知の許可を要求
		if ("Notification" in window) {
			Notification.requestPermission();
		}

		// 通知音の初期化
		audioRef.current = new Audio("/sounds/notification.mp3");

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// 次のインターバルの種類を決定
	const getNextIntervalType = useCallback((): IntervalType => {
		if (intervalType === "focus") {
			// フォーカス後は、4セッション完了時に長時間休憩、それ以外は短時間休憩
			const nextIntervalCount = completedIntervals + 1;
			return nextIntervalCount % TIMER_SETTINGS.intervalsUntilLongBreak === 0
				? "long_break"
				: "short_break";
		}
		// 休憩後は常にフォーカスセッション
		return "focus";
	}, [intervalType, completedIntervals]);

	// インターバル完了時の処理
	const handleIntervalComplete = useCallback(async () => {
		const nextIntervalType = getNextIntervalType();
		let nextDuration: number;

		// 次のインターバルの時間を設定
		switch (nextIntervalType) {
			case "focus":
				nextDuration = TIMER_SETTINGS.focusDuration;
				break;
			case "short_break":
				nextDuration = TIMER_SETTINGS.shortBreakDuration;
				break;
			case "long_break":
				nextDuration = TIMER_SETTINGS.longBreakDuration;
				break;
		}

		// 現在のインターバルを終了
		if (sessionRef.current?.intervalId) {
			await endInterval(sessionRef.current.intervalId);
		}

		// フォーカスセッション完了時のみインターバルカウントを更新
		if (intervalType === "focus") {
			setCompletedIntervals((prev) => prev + 1);
			// フォーカスセッションを終了
			if (sessionRef.current?.id) {
				await endFocusSession(sessionRef.current.id);
				sessionRef.current = null;
			}
		}

		// 通知を送信
		if ("Notification" in window && Notification.permission === "granted") {
			const notificationTitle =
				nextIntervalType === "focus" ? "フォーカス" : "休憩";
			const notificationBody =
				nextIntervalType === "focus"
					? "集中セッションを開始しましょう"
					: nextIntervalType === "long_break"
						? "30分の休憩を取りましょう"
						: "5分間の休憩を取りましょう";

			new Notification(`${notificationTitle}の時間です`, {
				body: notificationBody,
			});
		}

		// 通知音を再生
		if (audioRef.current) {
			audioRef.current.play().catch(console.error);
		}

		// 状態を更新
		setIntervalType(nextIntervalType);
		setTime(nextDuration);
		setTotalTime(nextDuration);
		setIsRunning(false);
	}, [intervalType, getNextIntervalType]);

	// タイマーの更新
	useEffect(() => {
		if (isRunning) {
			timerRef.current = setInterval(() => {
				setTime((prevTime) => {
					if (prevTime <= 1) {
						handleIntervalComplete();
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);
		} else if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isRunning, handleIntervalComplete]);

	const startSession = useCallback(async () => {
		await handleError(startFocusSession(), {
			onSuccess: (session) => {
				setCurrentSessionId(session.id);
			},
			successMessage: "フォーカスセッションを開始しました",
		});
	}, [handleError]);

	const endSession = useCallback(async () => {
		if (!currentSessionId) return;

		await handleError(endFocusSession(currentSessionId), {
			onSuccess: () => {
				setCurrentSessionId(null);
			},
			successMessage: "フォーカスセッションを終了しました",
		});
	}, [currentSessionId, handleError]);

	const startNewInterval = useCallback(async () => {
		if (!currentSessionId) return;

		await handleError(startInterval(currentSessionId, intervalType), {
			onSuccess: (interval) => {
				setCurrentIntervalId(interval.id);
			},
			successMessage: "インターバルを開始しました",
		});
	}, [currentSessionId, intervalType, handleError]);

	const endCurrentInterval = useCallback(async () => {
		if (!currentIntervalId) return;

		await handleError(endInterval(currentIntervalId), {
			onSuccess: () => {
				setCurrentIntervalId(null);
				setCompletedIntervals((prev) => prev + 1);
			},
			successMessage: "インターバルを終了しました",
		});
	}, [currentIntervalId, handleError]);

	// タイマーの開始/停止
	const toggleTimer = useCallback(async () => {
		if (!isRunning) {
			if (!currentSessionId) {
				await startSession();
			}
			await startNewInterval();
			setIsRunning(true);
		} else {
			await endCurrentInterval();
			setIsRunning(false);
		}
	}, [
		isRunning,
		currentSessionId,
		startSession,
		startNewInterval,
		endCurrentInterval,
	]);

	// タイマーのリセット
	const resetTimer = useCallback(async () => {
		if (isRunning) {
			await endCurrentInterval();
		}
		if (currentSessionId) {
			await endSession();
		}
		setIsRunning(false);
		setIntervalType("focus");
		setTime(TIMER_SETTINGS.focusDuration);
		setTotalTime(TIMER_SETTINGS.focusDuration);
		setCompletedIntervals(0);
		setCurrentSessionId(null);
		setCurrentIntervalId(null);
	}, [isRunning, currentSessionId, endCurrentInterval, endSession]);

	return {
		time,
		totalTime,
		intervalType,
		isRunning,
		completedIntervals,
		toggleTimer,
		resetTimer,
	};
}
