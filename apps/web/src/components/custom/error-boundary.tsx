"use client";

import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

/**
 * エラーバウンダリーコンポーネント
 * 子コンポーネントで発生したエラーをキャッチし、フォールバックUIを表示する
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error): void {
		// エラーログの送信などの処理を行う
		console.error("Error caught by error boundary:", error);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}
