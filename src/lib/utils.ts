import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("ja-JP", {
		style: "currency",
		currency: "JPY",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function convertToCamelCase<T>(obj: Record<string, any>): T {
	const newObj: Record<string, any> = {};

	for (const key of Object.keys(obj)) {
		const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
		newObj[newKey] = obj[key];
	}

	return newObj as T;
}
