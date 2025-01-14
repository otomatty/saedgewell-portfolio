"use client";

import type { FeatureEstimate } from "@/lib/gemini";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type EstimateResultProps = {
	estimates: FeatureEstimate[];
};

export function EstimateResult({ estimates }: EstimateResultProps) {
	// 合計の見積もりを計算
	const totalEstimate = estimates.reduce(
		(acc, curr) => ({
			time: {
				min: acc.time.min + curr.timeEstimate.min,
				max: acc.time.max + curr.timeEstimate.max,
			},
			cost: {
				min: acc.cost.min + curr.costEstimate.min,
				max: acc.cost.max + curr.costEstimate.max,
			},
		}),
		{
			time: { min: 0, max: 0 },
			cost: { min: 0, max: 0 },
		},
	);

	// 複雑さに応じた色を返す
	const getComplexityColor = (complexity: string) => {
		switch (complexity) {
			case "low":
				return "bg-green-100 text-green-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "high":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold mb-2">見積もり結果</h2>
				<p className="text-gray-600 mb-4">
					選択された機能の実装に必要な時間と費用の見積もりです。
					見積もりには機能の複雑さや実装方針が考慮されています。
				</p>
			</div>

			<div className="rounded-lg border p-4 bg-gray-50">
				<h3 className="text-lg font-semibold mb-2">合計見積もり</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-600">実装期間</p>
						<p className="text-lg font-medium">
							{totalEstimate.time.min}日 ～ {totalEstimate.time.max}日
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">費用</p>
						<p className="text-lg font-medium">
							{formatCurrency(totalEstimate.cost.min)} ～{" "}
							{formatCurrency(totalEstimate.cost.max)}
						</p>
					</div>
				</div>
			</div>

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>機能</TableHead>
							<TableHead>複雑さ</TableHead>
							<TableHead>実装期間</TableHead>
							<TableHead>費用</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{estimates.map((estimate) => (
							<TableRow key={estimate.name}>
								<TableCell className="font-medium">
									<div>
										<p>{estimate.name}</p>
										{estimate.notes && (
											<p className="text-sm text-gray-500 mt-1">
												{estimate.notes}
											</p>
										)}
									</div>
								</TableCell>
								<TableCell>
									<Badge
										className={getComplexityColor(estimate.complexity)}
										variant="secondary"
									>
										{estimate.complexity === "low"
											? "低"
											: estimate.complexity === "medium"
												? "中"
												: "高"}
									</Badge>
								</TableCell>
								<TableCell>
									{estimate.timeEstimate.min}日 ～ {estimate.timeEstimate.max}日
								</TableCell>
								<TableCell>
									{formatCurrency(estimate.costEstimate.min)} ～{" "}
									{formatCurrency(estimate.costEstimate.max)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="text-sm text-gray-500">
				<p>※ 見積もりには以下の前提が含まれています：</p>
				<ul className="list-disc list-inside ml-4 mt-2">
					<li>1人での開発を前提とした工数</li>
					<li>既存のライブラリやツールを活用した効率的な実装</li>
					<li>必要最低限の機能に絞った実装方針</li>
					<li>基本的なテストとバグ修正の時間を含む</li>
				</ul>
			</div>
		</div>
	);
}
