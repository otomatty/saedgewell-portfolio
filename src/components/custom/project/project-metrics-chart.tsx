"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface ProjectMetricsChartProps {
	data: {
		date?: string;
		week?: string;
		workHours: number;
		taskCompletion: number;
	}[];
}

/**
 * プロジェクトメトリクスチャートコンポーネント
 * @param props - チャートデータ
 */
export function ProjectMetricsChart({ data }: ProjectMetricsChartProps) {
	return (
		<div className="h-[300px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<XAxis dataKey={data[0]?.date ? "date" : "week"} fontSize={12} />
					<YAxis fontSize={12} />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="workHours"
						name="稼働時間"
						stroke="#2563eb"
						strokeWidth={2}
					/>
					<Line
						type="monotone"
						dataKey="taskCompletion"
						name="タスク完了率"
						stroke="#16a34a"
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
