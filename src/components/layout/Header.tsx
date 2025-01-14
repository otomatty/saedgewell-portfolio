import Link from "next/link";
import Navigation from "./Navigation";
import { ModeToggle } from "@/components/mode-toggle";
import MobileMenuTrigger from "./MobileMenuTrigger";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<Link href="/" className="mr-6 flex items-center space-x-2">
					<span className="font-bold">Portfolio</span>
				</Link>
				<div className="hidden md:block">
					<Navigation />
				</div>
				<div className="ml-auto flex items-center space-x-4">
					<ModeToggle />
					<MobileMenuTrigger />
				</div>
			</div>
		</header>
	);
}
