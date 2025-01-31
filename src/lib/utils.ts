import { clsx, type ClassValue } from "clsx";
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
