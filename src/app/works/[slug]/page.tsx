import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkBySlug, getWorkSlugsForBuild } from "@/app/_actions/works";
import { WorkDetailHero } from "./_components/WorkDetailHero";
import { WorkDetail } from "./_components/WorkDetail";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
	const works = await getWorkSlugsForBuild();
	return works.map((work) => ({
		slug: work.slug,
	}));
}

// 実績データの型定義
interface WorkData {
	title: string;
	description: string;
	thumbnail: string;
	technologies: string[];
	category: "company" | "freelance" | "personal";
	slug: string;
	links?: {
		github?: string;
		website?: string;
	};
	overview: string;
	role: string;
	period: string;
	teamSize: string;
	responsibilities: string[];
	challenges: {
		title: string;
		description: string;
	}[];
	solutions: {
		title: string;
		description: string;
	}[];
	results: string[];
	images: {
		url: string;
		alt: string;
		caption?: string;
	}[];
}

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const workData = await getWorkBySlug(slug);
	const work = Array.isArray(workData) ? workData[0] : workData;

	if (!work) {
		return {
			title: "Not Found | Saedge Well",
			description: "ページが見つかりませんでした。",
		};
	}

	return {
		title: `${work.title} | Saedge Well`,
		description: work.description,
		openGraph: {
			title: work.title,
			description: work.description,
			type: "article",
			publishedTime: work.created_at
				? new Date(work.created_at).toISOString()
				: undefined,
		},
	};
}

export default async function WorkPage({ params }: PageProps) {
	const { slug } = await params;
	const workData = await getWorkBySlug(slug);
	const work = Array.isArray(workData) ? workData[0] : workData;

	if (!work) {
		notFound();
	}

	return (
		<main>
			<WorkDetailHero
				title={work.title}
				description={work.description}
				technologies={work.work_technologies.map(
					({ technologies }) => technologies,
				)}
				githubUrl={work.github_url}
				websiteUrl={work.website_url}
			/>
			<div className="container py-20">
				<WorkDetail work={work} />
			</div>
		</main>
	);
}
