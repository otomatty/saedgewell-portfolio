"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: string;
	storageKey?: string;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "theme",
	...props
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme={defaultTheme}
			enableSystem
			storageKey={storageKey}
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
