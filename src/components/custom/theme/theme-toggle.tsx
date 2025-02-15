"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="outline" size="icon">
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">テーマを切り替える</span>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					{theme !== "system" && (
						<>
							<Sun
								className={`h-[1.2rem] w-[1.2rem] transition-all ${
									theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
								}`}
							/>
							<Moon
								className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
									theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
								}`}
							/>
						</>
					)}
					{theme === "system" && (
						<Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />
					)}
					<span className="sr-only">テーマを切り替える</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-[1.2rem] w-[1.2rem]" />
					ライト
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-[1.2rem] w-[1.2rem]" />
					ダーク
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Monitor className="mr-2 h-[1.2rem] w-[1.2rem]" />
					システム
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
