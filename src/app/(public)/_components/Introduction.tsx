"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
	PersonIcon,
	StackIcon,
	CodeIcon,
	FileTextIcon,
	Link1Icon,
	TextIcon,
	GlobeIcon,
	GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { BentoGrid, BentoCard } from "@/components/bento-grid";
import { NumberTicker } from "@/components/ui/number-ticker";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { cn } from "@/lib/utils";
import { techStacks, type TechStack } from "@/data/tech-stacks";

/**
 * 技術スタックアイコンカードコンポーネント
 */
const TechStackIcon = ({ tech }: { tech: TechStack }) => (
	<div className="flex items-center justify-center">
		<Image
			src={tech.icon}
			alt={tech.name}
			width={35}
			height={35}
			className={cn("w-10 h-10", tech.color)}
		/>
	</div>
);

/**
 * 技術スタックを表示するコンポーネント
 */
const TechStackGrid = () => (
	<div className="absolute right-2 top-4 h-[400px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_70%)] group-hover:scale-105">
		<div className="relative w-full h-full flex items-center justify-center mt-10">
			{/* 外側の円 - 時計回り */}
			<OrbitingCircles radius={200} speed={0.5} iconSize={40}>
				{techStacks.outer.map((tech) => (
					<TechStackIcon key={tech.name} tech={tech} />
				))}
			</OrbitingCircles>

			{/* 中間の円 - 反時計回り（中程度の速さ） */}
			<OrbitingCircles radius={130} speed={0.6} iconSize={35} reverse>
				{techStacks.middle.map((tech) => (
					<TechStackIcon key={tech.name} tech={tech} />
				))}
			</OrbitingCircles>

			{/* 内側の円 - 時計回り（やや速め） */}
			<OrbitingCircles radius={70} speed={0.7} iconSize={30}>
				{techStacks.inner.map((tech) => (
					<TechStackIcon key={tech.name} tech={tech} />
				))}
			</OrbitingCircles>
		</div>
	</div>
);

/**
 * SNSアイコンコンポーネント
 */
const SocialIcon = ({ type }: { type: string }) => {
	const iconClass = "w-16 h-16";
	switch (type) {
		case "LinkedIn":
			return <div className={`${iconClass} text-[#0A66C2]`}>in</div>;
		case "GitHub":
			return (
				<div className={`${iconClass} text-neutral-900 dark:text-white`}>
					GH
				</div>
			);
		case "Scrapbox":
			return <div className={`${iconClass}`}>SB</div>;
		case "Zenn":
			return <div className={`${iconClass} text-[#3EA8FF]`}>Zn</div>;
		default:
			return null;
	}
};

/**
 * 数値表示カードの背景コンポーネント
 */
const NumberDisplay = ({ value, unit }: { value: number; unit: string }) => (
	<div className="flex items-center justify-center h-full">
		<div className="text-6xl font-bold text-primary">
			<NumberTicker value={value} />
		</div>
		<span className="text-2xl text-primary ml-2">{unit}</span>
	</div>
);

/**
 * イントロダクションセクション
 * BentoGridを使用してプロフィール情報を表示
 */
export const Introduction = () => {
	const cards = [
		// プロフィールカード（左上）
		{
			name: "Akimasa Sugai",
			className: "md:col-span-8 md:row-span-2",
			background: (
				<div className="relative w-full h-full">
					<Image
						src="/images/profile.jpg"
						alt="Profile"
						fill
						className="object-cover"
						priority
					/>
				</div>
			),
			Icon: PersonIcon,
			description:
				"フロントエンドからバックエンド、インフラまで幅広い技術スタックを活用し、ビジネスの成長に貢献するソリューションを提供しています。",
			href: "/about",
			cta: "詳細プロフィール",
		},
		// 数値カード群（右上 2×2グリッド）
		{
			name: "開発経験",
			className: "md:col-start-9 md:col-span-2",
			background: <NumberDisplay value={5} unit="年" />,
			Icon: CodeIcon,
			description: "フルスタック開発経験",
			href: "/experience",
			cta: "経験を見る",
		},
		{
			name: "プロジェクト実績",
			className: "md:col-start-11 md:col-span-2",
			background: <NumberDisplay value={50} unit="件" />,
			Icon: TextIcon,
			description: "様々な規模のプロジェクト開発",
			href: "/projects",
			cta: "実績を見る",
		},
		{
			name: "技術記事",
			className: "md:col-start-9 md:col-span-2",
			background: <NumberDisplay value={30} unit="記事" />,
			Icon: FileTextIcon,
			description: "技術的な知見の発信",
			href: "/articles",
			cta: "記事を読む",
		},
		{
			name: "個人開発",
			className: "md:col-start-11 md:col-span-2",
			background: <NumberDisplay value={10} unit="個" />,
			Icon: CodeIcon,
			description: "個人で開発したプロジェクト",
			href: "/personal-projects",
			cta: "プロジェクトを見る",
		},
		// SNSリンク群（左下 2×2グリッド）
		{
			name: "GitHub",
			className: "md:col-start-1 md:col-span-2 md:row-span-2",
			background: <GitHubLogoIcon className="w-16 h-16" />,
			Icon: Link1Icon,
			href: "https://github.com/ottomatty",
			cta: "リポジトリを見る",
		},
		{
			name: "Scrapbox",
			className: "md:col-start-3 md:col-span-2 md:row-span-2",
			background: <SocialIcon type="Scrapbox" />,
			Icon: Link1Icon,
			href: "https://scrapbox.io/saedgewell",
			cta: "ノートを見る",
		},
		{
			name: "Zenn",
			className: "md:col-start-5 md:col-span-2",
			background: <SocialIcon type="Zenn" />,
			Icon: Link1Icon,
			href: "https://zenn.dev/saedgewell",
			cta: "記事を読む",
		},
		{
			name: "LinkedIn",
			className: "md:col-start-5 md:col-span-2",
			background: <SocialIcon type="LinkedIn" />,
			Icon: Link1Icon,
			href: "https://linkedin.com/in/saedgewell",
			cta: "プロフィールを見る",
		},
		// 技術スタックカード（右下）
		{
			name: "技術スタック",
			className: "md:col-start-7 md:row-start-3 md:col-span-6 md:row-span-2",
			background: <TechStackGrid />,
			Icon: StackIcon,
			description: "モダンな技術スタックを活用した開発経験",
			href: "/skills",
			cta: "スキル詳細",
		},
	];

	return (
		<section className="py-20 bg-secondary">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<BentoGrid>
						{cards.map((card) => (
							<BentoCard key={card.name} {...card} />
						))}
					</BentoGrid>
				</motion.div>
			</div>
		</section>
	);
};
