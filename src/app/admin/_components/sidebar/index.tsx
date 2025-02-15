"use client";
// library
import type * as React from "react";
import Link from "next/link";

import { AdminNavMain } from "./nav-main";
import { AdminNavUser } from "./nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { DatePicker } from "./date-picker";
import { Calendars } from "./calendars";
import type { Profile } from "@/types/profile";
import { navItems } from "./nav-items";

export function AdminSidebar({
	profile,
	...props
}: React.ComponentProps<typeof Sidebar> & { profile: Profile }) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex h-14 items-center justify-center">
					<h1 className="text-xl font-bold">
						<Link href="/admin">Saedgewell</Link>
					</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<DatePicker />
				<SidebarSeparator className="mx-0" />
				<SidebarSeparator />
				<AdminNavMain items={navItems} />
			</SidebarContent>

			<SidebarRail />
			<SidebarFooter>
				<AdminNavUser profile={profile} />
			</SidebarFooter>
		</Sidebar>
	);
}
