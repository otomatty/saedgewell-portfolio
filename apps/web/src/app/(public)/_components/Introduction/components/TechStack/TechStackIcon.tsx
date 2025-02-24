import Image from "next/image";
import { cn } from "../../../../../../lib/utils";
import type { TechStack } from "../../../../../../data/tech-stacks";

/**
 * 技術スタックアイコンを表示するコンポーネント
 */
export const TechStackIcon = ({ tech }: { tech: TechStack }) => (
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
