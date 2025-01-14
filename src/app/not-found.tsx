import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">
					404 - ページが見つかりません
				</h1>
				<p className="text-muted-foreground mb-8">
					お探しのページは存在しないか、移動した可能性があります。
				</p>
				<Button asChild>
					<Link href="/">ホームに戻る</Link>
				</Button>
			</div>
		</div>
	);
}
