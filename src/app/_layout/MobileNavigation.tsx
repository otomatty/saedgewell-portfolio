"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
	{
		title: "About",
		href: "/about",
	},
	{
		title: "Works",
		href: "/works",
	},
	{
		title: "Services",
		items: [
			{
				title: "サービス一覧",
				href: "/services",
			},
			{
				title: "開発プロセス",
				href: "/services/process",
			},
			{
				title: "料金",
				href: "/services/pricing",
			},
			{
				title: "見積もり",
				href: "/services/estimate",
			},
		],
	},
	{
		title: "Blog",
		href: "/blog",
	},
	{
		title: "Contact",
		href: "/contact",
	},
] as const;

export const MobileNavigation = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">メニューを開く</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-64">
				<nav className="flex flex-col gap-4">
					{navigationItems.map((item) => {
						if ("items" in item) {
							return item.items.map((subItem) => (
								<Link
									key={subItem.title}
									href={subItem.href}
									onClick={() => setOpen(false)}
									className={cn(
										"px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
										{
											"bg-accent": pathname === subItem.href,
										},
									)}
								>
									{subItem.title}
								</Link>
							));
						}
						return (
							<Link
								key={item.title}
								href={item.href}
								onClick={() => setOpen(false)}
								className={cn(
									"px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
									{
										"bg-accent": pathname === item.href,
									},
								)}
							>
								{item.title}
							</Link>
						);
					})}
				</nav>
			</SheetContent>
		</Sheet>
	);
};
