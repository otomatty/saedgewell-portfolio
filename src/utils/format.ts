/**
 * ファイルサイズを人間が読みやすい形式にフォーマットする
 * @param bytes ファイルサイズ（バイト）
 * @returns フォーマットされたファイルサイズ
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";

	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 日付を日本語フォーマットに変換する
 * @param date - ISO形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: string): string {
	return format(new Date(date), "yyyy年MM月dd日", { locale: ja });
}

export function formatDateTime(date: string): string {
	return format(new Date(date), "yyyy年MM月dd日 HH:mm:ss", { locale: ja });
}

/**
 * 数値を日本語フォーマットに変換する
 * @param num - フォーマットする数値
 * @returns フォーマットされた数値文字列
 */
export function formatNumber(num: number): string {
	return new Intl.NumberFormat("ja-JP").format(num);
}

/**
 * 時間を日本語フォーマットに変換する
 * @param seconds - 秒数
 * @returns フォーマットされた時間文字列
 */
export function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	return `${hours}時間${minutes}分${remainingSeconds}秒`;
}
