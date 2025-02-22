import { useToast } from "@/hooks/use-toast";
import type { AppError } from "@/types/error";

/**
 * エラーハンドリング用のカスタムフック
 */
export function useErrorHandler() {
	const { toast } = useToast();

	const handleError = async <T>(
		promise: Promise<T>,
		options?: {
			onSuccess?: (data: T) => void;
			onError?: (error: AppError) => void;
			successMessage?: string;
		},
	): Promise<T | undefined> => {
		try {
			const data = await promise;

			if (options?.successMessage) {
				toast({
					description: options.successMessage,
				});
			}

			options?.onSuccess?.(data);
			return data;
		} catch (error) {
			const appError = error as AppError;
			toast({
				title: "エラー",
				description: appError.message,
				variant: "destructive",
			});

			options?.onError?.(appError);
			return undefined;
		}
	};

	return { handleError };
}
