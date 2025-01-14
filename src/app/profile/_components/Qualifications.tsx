"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/types";
import HistorySection from "./HistorySection";

type Props = {
	qualifications: Profile["qualifications"];
};

export default function Qualifications({ qualifications }: Props) {
	return (
		<HistorySection title="資格">
			{(qualifications ?? []).map((qual, index) => (
				<motion.div
					key={qual.name}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<h3 className="font-semibold text-lg">{qual.name}</h3>
					<p className="text-sm text-muted-foreground">
						{qual.acquiredDate.getFullYear()}年
						{qual.acquiredDate.getMonth() + 1}月取得
					</p>
				</motion.div>
			))}
		</HistorySection>
	);
}
