"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
	/**
	 * Markdownコンテンツ
	 */
	content: string;
	/**
	 * 追加のクラス名
	 */
	className?: string;
}

/**
 * Markdownコンテンツを安全にレンダリングするコンポーネント
 * - GFM (GitHub Flavored Markdown) をサポート
 * - シンタックスハイライトをサポート
 * - XSS対策済み
 */
export const Markdown = ({ content, className }: MarkdownProps) => {
	return (
		<div className={cn("prose prose-sm dark:prose-invert", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
				components={{
					// インライン要素のスタイル
					a: ({ className, ...props }) => (
						<a
							className={cn(
								"text-primary underline underline-offset-4 hover:text-primary/80",
								className,
							)}
							target="_blank"
							rel="noreferrer noopener"
							{...props}
						/>
					),
					code: ({ className, ...props }) => (
						<code
							className={cn(
								"rounded-md bg-muted px-1 py-0.5 font-mono text-sm",
								className,
							)}
							{...props}
						/>
					),
					// ブロック要素のスタイル
					pre: ({ className, ...props }) => (
						<pre
							className={cn(
								"mt-2 overflow-x-auto rounded-lg bg-muted p-4 [&>code]:!bg-transparent",
								className,
							)}
							{...props}
						/>
					),
					ul: ({ className, ...props }) => (
						<ul
							className={cn("list-inside list-disc space-y-1", className)}
							{...props}
						/>
					),
					ol: ({ className, ...props }) => (
						<ol
							className={cn("list-inside list-decimal space-y-1", className)}
							{...props}
						/>
					),
					blockquote: ({ className, ...props }) => (
						<blockquote
							className={cn(
								"mt-2 border-l-2 border-border pl-4 italic text-muted-foreground",
								className,
							)}
							{...props}
						/>
					),
					hr: ({ className, ...props }) => (
						<hr className={cn("my-4 border-border", className)} {...props} />
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};
