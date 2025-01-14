"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Skill } from "@/types";

type Props = {
	skill: Skill;
	getLevelText: (level: number) => string;
};

export default function SkillCard({ skill, getLevelText }: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
		>
			<Card>
				<CardHeader>
					<div className="flex justify-between items-start gap-4">
						<CardTitle>{skill.name}</CardTitle>
						<Badge>{getLevelText(skill.level)}</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{skill.description}</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}
