import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThemeProvider } from "next-themes";

// テスト用のラッパーコンポーネント
const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
};

// カスタムレンダー関数
const customRender = (ui: ReactElement) => {
	return render(ui, {
		wrapper: Providers,
	});
};

export * from "@testing-library/react";
export { customRender as render };
