"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon, type iconComponents } from "./icons";

type Step = {
	iconName: string;
	title: string;
	description: string;
};

type Props = {
	steps: Step[];
};

export default function WorkingProcess({ steps }: Props) {
	return (
		<section id="working-process" className="py-20 bg-muted/50">
			<div className="container">
				<h2 className="text-3xl font-bold text-center mb-12">仕事の進め方</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{steps.map((step, index) => {
						return (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card className="relative h-full">
									<div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
										{index + 1}
									</div>
									<CardContent className="pt-8">
										<DynamicIcon
											name={step.iconName as keyof typeof iconComponents}
											className="h-8 w-8 text-primary mb-4"
										/>
										<h3 className="font-semibold mb-2">{step.title}</h3>
										<p className="text-sm text-muted-foreground">
											{step.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
