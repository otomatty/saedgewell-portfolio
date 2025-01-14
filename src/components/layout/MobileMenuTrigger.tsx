"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { MENU_ITEMS } from "./Navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MobileMenuTrigger() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					aria-label="メニューを開く"
				>
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-80">
				<nav className="flex flex-col gap-4 mt-8">
					{MENU_ITEMS.map((item) => {
						if ("type" in item && item.type === "mega") {
							return (
								<div key={item.label} className="space-y-4">
									<h3 className="font-medium text-sm text-muted-foreground px-4">
										{item.label}
									</h3>
									{item.sections.map((section) => (
										<div key={section.title} className="space-y-2">
											<h4 className="text-xs text-muted-foreground px-4">
												{section.title}
											</h4>
											{section.items.map((subItem) => (
												<Link
													key={subItem.href}
													href={subItem.href}
													onClick={() => setIsOpen(false)}
													className={cn(
														"block px-4 py-2 text-sm hover:bg-accent",
													)}
												>
													{subItem.title}
												</Link>
											))}
										</div>
									))}
								</div>
							);
						}

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className="block px-4 py-2 text-sm hover:bg-accent"
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
