"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { Profile } from "@/types";

type Props = {
	careerHistory: Profile["careerHistory"];
};

export default function CareerHistory({ careerHistory }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>職務経歴</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{careerHistory.map((career, index) => (
					<motion.div
						key={`${career.companyName}-${career.period.start}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<h3 className="font-semibold text-lg">{career.companyName}</h3>
						<p className="text-sm text-muted-foreground mb-2">
							{career.period.start.getFullYear()}年
							{career.period.start.getMonth() + 1}月 -{" "}
							{career.period.end
								? `${career.period.end.getFullYear()}年${
										career.period.end.getMonth() + 1
									}月`
								: "現在"}
							　|　{career.position}
						</p>
						<p className="text-muted-foreground">{career.description}</p>
					</motion.div>
				))}
			</CardContent>
		</Card>
	);
}
