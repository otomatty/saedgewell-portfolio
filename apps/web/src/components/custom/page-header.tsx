import { cn } from "../../lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
}

/**
 * ページヘッダーコンポーネント
 * - タイトルと説明文を表示
 * - レスポンシブ対応
 * - カスタムクラスの適用が可能
 */
export function PageHeader({ title, description, className }: PageHeaderProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
			{description && (
				<p className="text-lg text-muted-foreground">{description}</p>
			)}
		</div>
	);
}
