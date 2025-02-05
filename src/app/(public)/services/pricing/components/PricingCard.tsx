"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export interface PricingFeature {
	name: string;
}

export interface PricingCardProps {
	name: string;
	description: string;
	basePrice: string;
	period: string;
	features: string[];
	note: string;
	index: number;
}

export const PricingCard = ({
	name,
	description,
	basePrice,
	period,
	features,
	note,
	index,
}: PricingCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
		>
			<Card className="h-full hover:shadow-lg transition-shadow">
				<CardHeader>
					<div className="space-y-2">
						<h3 className="text-2xl font-bold">{name}</h3>
						<p className="text-muted-foreground">{description}</p>
						<div className="pt-4">
							<div className="text-3xl font-bold">{basePrice}</div>
							<p className="text-sm text-muted-foreground">
								標準期間：{period}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h4 className="font-semibold mb-3">主な機能：</h4>
						<ul className="space-y-2">
							{features.map((feature) => (
								<li
									key={feature}
									className="flex items-center text-sm text-muted-foreground"
								>
									<Badge variant="secondary" className="mr-2">
										✓
									</Badge>
									{feature}
								</li>
							))}
						</ul>
					</div>
					<p className="text-sm text-muted-foreground">※ {note}</p>
				</CardContent>
			</Card>
		</motion.div>
	);
};
