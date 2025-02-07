/**
 * 数値を日本語フォーマットに変換する
 * @param num - フォーマットする数値
 * @returns フォーマットされた数値文字列
 */
export function formatNumber(num: number): string {
	return new Intl.NumberFormat("ja-JP").format(num);
}
