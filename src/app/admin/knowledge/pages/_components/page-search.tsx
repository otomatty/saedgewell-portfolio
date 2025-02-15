import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function PageSearch() {
	return (
		<div className="grid gap-4 md:grid-cols-4">
			<div className="space-y-2">
				<Label>キーワード</Label>
				<Input placeholder="検索キーワード" />
			</div>

			<div className="space-y-2">
				<Label>プロジェクト</Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="プロジェクトを選択" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">すべて</SelectItem>
						<SelectItem value="saedgewell-portfolio">
							saedgewell-portfolio
						</SelectItem>
						<SelectItem value="tech-notes">tech-notes</SelectItem>
						<SelectItem value="private-notes">private-notes</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>並び順</Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="並び順を選択" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="updated-desc">更新日時（新しい順）</SelectItem>
						<SelectItem value="updated-asc">更新日時（古い順）</SelectItem>
						<SelectItem value="created-desc">作成日時（新しい順）</SelectItem>
						<SelectItem value="created-asc">作成日時（古い順）</SelectItem>
						<SelectItem value="title-asc">タイトル（昇順）</SelectItem>
						<SelectItem value="title-desc">タイトル（降順）</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>表示件数</Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="表示件数を選択" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10件</SelectItem>
						<SelectItem value="20">20件</SelectItem>
						<SelectItem value="50">50件</SelectItem>
						<SelectItem value="100">100件</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
