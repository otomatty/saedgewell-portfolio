"use client";

import { SidebarTrigger } from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";
import { NotificationPopover } from "../../../components/custom/notification/notification-popover";
import { ThemeToggle } from "../../../components/custom/theme/theme-toggle";
import { useNotifications } from "../../../hooks/use-notifications";

export function AuthHeader() {
	const { updateSettings } = useNotifications();

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex flex-1 items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
			</div>
			<div className="flex items-center gap-2 px-4">
				<ThemeToggle />
				<NotificationPopover onUpdateSettings={updateSettings} />
			</div>
		</header>
	);
}
