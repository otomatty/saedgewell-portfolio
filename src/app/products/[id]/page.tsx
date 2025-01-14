import { getProjectById } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
	params: {
		id: string;
	};
};

export default function ProjectDetailPage({ params }: Props) {
	const project = getProjectById(params.id);

	if (!project) {
		notFound();
	}

	return (
		<div className="min-h-screen py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-8"
				>
					{/* ヘッダー部分 */}
					<div className="text-center">
						<h1 className="text-4xl font-bold mb-4">{project.title}</h1>
						<p className="text-xl text-muted-foreground mb-6">
							{project.summary}
						</p>
						<div className="flex justify-center gap-4">
							{project.demoUrl && (
								<Button asChild>
									<a
										href={project.demoUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										デモを見る
									</a>
								</Button>
							)}
							{project.repositoryUrl && (
								<Button asChild variant="outline">
									<a
										href={project.repositoryUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										ソースコードを見る
									</a>
								</Button>
							)}
						</div>
					</div>

					{/* メイン画像 */}
					<div className="relative aspect-video">
						<Image
							src={project.thumbnailUrl}
							alt={project.title}
							fill
							className="object-cover rounded-lg"
							priority
						/>
					</div>

					{/* プロジェクト詳細 */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="md:col-span-2 space-y-6">
							<section>
								<h2 className="text-2xl font-semibold mb-4">概要</h2>
								<p className="text-muted-foreground whitespace-pre-wrap">
									{project.description}
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold mb-4">主な成果</h2>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground">
									{project.achievements.map((achievement) => (
										<li key={achievement}>{achievement}</li>
									))}
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold mb-4">
									スクリーンショット
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{project.screenshots.map((screenshot) => (
										<div key={screenshot} className="relative aspect-video">
											<Image
												src={screenshot}
												alt={`${project.title}のスクリーンショット`}
												fill
												className="object-cover rounded-lg"
											/>
										</div>
									))}
								</div>
							</section>
						</div>

						<div className="space-y-6">
							<section>
								<h2 className="text-2xl font-semibold mb-4">
									プロジェクト情報
								</h2>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium mb-2">役割</h3>
										<p className="text-muted-foreground">{project.role}</p>
									</div>
									<div>
										<h3 className="font-medium mb-2">プロジェクトタイプ</h3>
										<Badge>{project.type}</Badge>
									</div>
									<div>
										<h3 className="font-medium mb-2">使用技術</h3>
										<div className="flex flex-wrap gap-2">
											{project.techStack.map((tech) => (
												<Badge key={tech} variant="outline">
													{tech}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>

					{/* 戻るボタン */}
					<div className="text-center mt-12">
						<Button asChild variant="outline">
							<Link href="/products">← プロジェクト一覧に戻る</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
