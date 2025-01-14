"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Profile } from "@/types";
import SocialLinks from "./SocialLinks";

type Props = {
	profile: Profile;
};

export default function ProfileHeader({ profile }: Props) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-col md:flex-row gap-8 items-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						className="relative w-48 h-48 rounded-full overflow-hidden"
					>
						<Image
							src={profile.photoUrl}
							alt={profile.name}
							fill
							className="object-cover"
							priority
						/>
					</motion.div>
					<div className="flex-1 text-center md:text-left">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-3xl font-bold mb-4"
						>
							{profile.name}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="text-muted-foreground whitespace-pre-wrap"
						>
							{profile.introduction}
						</motion.p>
						<SocialLinks contacts={profile.contacts} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
