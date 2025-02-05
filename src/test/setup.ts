import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// テスト後にクリーンアップを実行
afterEach(() => {
	cleanup();
});
