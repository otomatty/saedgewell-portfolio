"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQ_ITEMS = [
	{
		question: "どのような規模のプロジェクトに対応可能ですか？",
		answer:
			"小規模なランディングページから大規模なWebアプリケーションまで、様々な規模のプロジェクトに対応可能です。プロジェクトの要件に応じて、最適なアプローチを提案させていただきます。",
	},
	{
		question: "開発期間はどのくらいかかりますか？",
		answer:
			"プロジェクトの規模や要件によって異なりますが、一般的な目安として、ランディングページであれば2-4週間、中規模のWebアプリケーションであれば2-3ヶ月程度です。具体的な期間は、要件定義の段階で見積もりをさせていただきます。",
	},
	{
		question: "契約形態は？",
		answer:
			"準委任契約での契約を基本としています。プロジェクトの内容に応じて、請負契約での対応も可能です。契約期間や稼働時間などは、プロジェクトの要件に合わせて柔軟に対応させていただきます。",
	},
	{
		question: "リモートワークは可能ですか？",
		answer:
			"はい、基本的にリモートワークでの対応となります。定期的なオンラインミーティングを通じて、プロジェクトの進捗や課題の共有を行います。必要に応じて、対面でのミーティングも可能です。",
	},
	{
		question: "着手までどのくらい時間がかかりますか？",
		answer:
			"通常、お問い合わせいただいてから1-2週間程度で着手可能です。ただし、既存の案件の状況によって前後する場合がございます。お急ぎの場合は、その旨をお伝えいただければ、可能な限り対応させていただきます。",
	},
];

export default function FAQ() {
	return (
		<section id="faq" className="py-20">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-3xl mx-auto"
				>
					<h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
					<Accordion type="single" collapsible className="w-full">
						{FAQ_ITEMS.map((item, index) => (
							<AccordionItem key={item.question} value={`item-${index}`}>
								<AccordionTrigger className="text-left">
									{item.question}
								</AccordionTrigger>
								<AccordionContent>{item.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
}
