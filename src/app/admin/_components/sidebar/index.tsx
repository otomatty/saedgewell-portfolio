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

const calendars = [
	{
		name: "2025年",
		items: [
			"1月",
			"2月",
			"3月",
			"4月",
			"5月",
			"6月",
			"7月",
			"8月",
			"9月",
			"10月",
			"11月",
			"12月",
		],
	},
];

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
				<Calendars calendars={calendars} />
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
