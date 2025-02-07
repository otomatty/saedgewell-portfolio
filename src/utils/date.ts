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
