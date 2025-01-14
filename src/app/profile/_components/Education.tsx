"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/types";
import HistorySection from "./HistorySection";

type Props = {
	education: Profile["education"];
};

export default function Education({ education }: Props) {
	return (
		<HistorySection title="学歴">
			{(education ?? []).map((edu, index) => (
				<motion.div
					key={`${edu.school}-${edu.period.start}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<h3 className="font-semibold text-lg">{edu.school}</h3>
					<p className="text-sm text-muted-foreground mb-2">
						{edu.period.start.getFullYear()}年{edu.period.start.getMonth() + 1}
						月 - {edu.period.end.getFullYear()}年{edu.period.end.getMonth() + 1}
						月
					</p>
					<p className="text-muted-foreground">{edu.degree}</p>
				</motion.div>
			))}
		</HistorySection>
	);
}
