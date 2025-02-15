import { NumberTicker } from "@/components/ui/number-ticker";

interface NumberDisplayProps {
	value: number;
	unit: string;
}

/**
 * 数値表示カードの背景コンポーネント
 */
export const NumberDisplay = ({ value, unit }: NumberDisplayProps) => (
	<div className="absolute top-6 left-6 flex items-end justify-center z-20">
		<div className="text-8xl font-bold text-primary">
			<NumberTicker value={value} />
		</div>
		<span className="text-2xl text-muted-foreground font-bold">{unit}</span>
	</div>
);
