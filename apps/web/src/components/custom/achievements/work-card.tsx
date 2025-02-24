import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import type { Work } from "../../../types/work";
import Image from "next/image";
import { motion } from "framer-motion";

interface WorkCardProps {
	work: Work;
}

/**
 * 実績カードコンポーネント
 * 縦長のサムネイル画像を中心に表示し、タイトルと技術スタックを下部に配置
 */
export const WorkCard = ({ work }: WorkCardProps) => {
	return (
		<div className="h-full space-y-3">
			{/* カード（画像のみ） */}
			<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
				<Card className="overflow-hidden group cursor-pointer">
					<div className="relative aspect-[3/4]">
						<div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
						<Image
							src={work.thumbnail_url}
							alt={work.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-110"
						/>
					</div>
				</Card>
			</motion.div>

			{/* タイトルと技術スタック */}
			<div className="space-y-2">
				<h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
					{work.title}
				</h3>
				<div className="flex flex-wrap gap-1">
					{work.work_technologies.slice(0, 3).map((tech) => (
						<Badge
							key={tech.technologies.id}
							variant="outline"
							className="text-xs bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary"
						>
							{tech.technologies.name}
						</Badge>
					))}
					{work.work_technologies.length > 3 && (
						<Badge
							variant="outline"
							className="text-xs bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary"
						>
							+{work.work_technologies.length - 3}
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
};
