import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
	title: string;
	children: React.ReactNode;
};

export default function HistorySection({ title, children }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">{children}</CardContent>
		</Card>
	);
}
