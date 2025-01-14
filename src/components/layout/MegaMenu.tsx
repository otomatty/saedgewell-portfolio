"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MegaMenuItem = {
	title: string;
	description: string;
	href: string;
};

type MegaMenuSection = {
	title: string;
	items: MegaMenuItem[];
};

type Props = {
	trigger: string;
	sections: MegaMenuSection[];
	isActive?: boolean;
};

export default function MegaMenu({ trigger, sections, isActive }: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={cn("flex items-center gap-1", isActive && "bg-accent")}
				>
					{trigger}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-screen sm:w-[600px] p-4 sm:p-6">
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
				>
					{sections.map((section) => (
						<div key={section.title}>
							<h3 className="mb-3 sm:mb-4 text-sm font-medium text-muted-foreground">
								{section.title}
							</h3>
							<div className="space-y-1 sm:space-y-2">
								{section.items.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="block rounded-md p-2 sm:p-3 hover:bg-accent transition-colors"
									>
										<h4 className="text-sm font-medium leading-none mb-1">
											{item.title}
										</h4>
										<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
											{item.description}
										</p>
									</Link>
								))}
							</div>
						</div>
					))}
				</motion.div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
