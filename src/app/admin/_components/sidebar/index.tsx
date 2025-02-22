"use client";
// library
import type * as React from "react";

import { AdminNavMain } from "./nav-main";
import { AdminNavUser } from "./nav-user";
import { AdminSidebarHeader } from "./sidebar-header";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
} from "@/components/ui/sidebar";

import type { Profile } from "@/types/profile";
import { navItems } from "./nav-items";

export function AdminSidebar({
	profile,
	...props
}: React.ComponentProps<typeof Sidebar> & { profile: Profile }) {
	return (
		<Sidebar collapsible="icon" {...props} className="w-64 border-r">
			<AdminSidebarHeader />
			<SidebarContent>
				<AdminNavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter className="border-t">
				<AdminNavUser profile={profile} />
			</SidebarFooter>
		</Sidebar>
	);
}
