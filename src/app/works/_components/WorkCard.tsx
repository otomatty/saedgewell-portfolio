"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { Database } from "@/types/supabase";

type WorkCardProps = Database["public"]["Tables"]["works"]["Row"] & {
	work_technologies: {
		technologies: Database["public"]["Tables"]["technologies"]["Row"];
	}[];
};

export function WorkCard(work: WorkCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
		>
			<Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
				<div className="relative h-48 w-full">
					<Image
						src={work.thumbnail_url}
						alt={work.title}
						fill
						className="object-cover transition-transform hover:scale-105"
					/>
				</div>
				<CardHeader className="space-y-2">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="text-xl font-bold">{work.title}</h3>
							<p className="text-sm text-muted-foreground">
								{work.description}
							</p>
						</div>
						<div className="flex gap-2">
							{work.github_url && (
								<Button variant="ghost" size="icon" asChild>
									<Link
										href={work.github_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Github className="h-4 w-4" />
									</Link>
								</Button>
							)}
							{work.website_url && (
								<Button variant="ghost" size="icon" asChild>
									<Link
										href={work.website_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4" />
									</Link>
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-2">
						{work.work_technologies
							.filter(({ technologies }) => technologies !== null)
							.map(({ technologies }) => (
								<Badge key={technologies.id} variant="secondary">
									{technologies.name}
								</Badge>
							))}
					</div>
					<Button asChild className="w-full">
						<Link href={`/works/${work.slug}`}>詳細を見る</Link>
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
