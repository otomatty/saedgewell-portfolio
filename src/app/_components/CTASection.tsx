"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Code2 } from "lucide-react";

const ctaCards = [
	{
		icon: Building2,
		title: "企業の方へ",
		description: "システム開発やコンサルティングのご依頼を承ります。",
		link: "/contact?type=company",
		buttonText: "企業様用お問い合わせ",
	},
	{
		icon: Users,
		title: "お仕事のご依頼・ご相談",
		description: "お仕事のご依頼・ご相談を承ります。",
		link: "/contact?type=general",
		buttonText: "お問い合わせ",
	},
	{
		icon: Code2,
		title: "個人開発",
		description:
			"個人開発プロダクトやオープンソースプロジェクトをご覧ください。",
		link: "/works/personal",
		buttonText: "個人開発を見る",
	},
];

export const CTASection = () => {
	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">お問い合わせ</h2>
					<p className="text-lg text-muted-foreground">
						ご要望に応じて最適なソリューションをご提案いたします
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{ctaCards.map((card, index) => (
						<motion.div
							key={card.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full">
								<CardHeader>
									<card.icon className="h-8 w-8 text-primary mb-2" />
									<CardTitle>{card.title}</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<p className="text-muted-foreground">{card.description}</p>
									<Button asChild className="w-full">
										<Link href={card.link}>{card.buttonText}</Link>
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
