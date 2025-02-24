import type { PostgrestError } from "@supabase/supabase-js";
import type { AppError, ErrorCode } from "../types/error";

/**
 * エラーコードとステータスコードのマッピング
 */
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	VALIDATION_ERROR: 400,
	DATABASE_ERROR: 500,
	INTERNAL_ERROR: 500,
};

/**
 * Supabaseのエラーをアプリケーションのエラーに変換する
 */
export function handleSupabaseError(error: PostgrestError): AppError {
	// エラーコードに基づいてエラー型を決定
	let code: ErrorCode = "DATABASE_ERROR";
	if (error.code === "PGRST116") {
		code = "NOT_FOUND";
	} else if (error.code === "42501") {
		code = "FORBIDDEN";
	} else if (error.code === "23505") {
		code = "VALIDATION_ERROR";
	}

	return {
		code,
		message: error.message,
		status: ERROR_STATUS_MAP[code],
		cause: error,
	};
}

/**
 * 未知のエラーをアプリケーションのエラーに変換する
 */
export function handleUnknownError(error: unknown): AppError {
	if (error instanceof Error) {
		return {
			code: "INTERNAL_ERROR",
			message: error.message,
			status: 500,
			cause: error,
		};
	}

	return {
		code: "INTERNAL_ERROR",
		message: "予期せぬエラーが発生しました",
		status: 500,
		cause: error,
	};
}

/**
 * エラーをアプリケーションのエラーに変換する
 */
export function handleError(error: unknown): AppError {
	if ((error as PostgrestError).code !== undefined) {
		return handleSupabaseError(error as PostgrestError);
	}

	return handleUnknownError(error);
}
