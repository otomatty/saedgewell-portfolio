"use client";

import dynamic from "next/dynamic";
import type { LucideProps } from "lucide-react";

export const iconComponents = {
	Code: dynamic(() => import("lucide-react").then((mod) => mod.Code)),
	Layout: dynamic(() => import("lucide-react").then((mod) => mod.Layout)),
	Rocket: dynamic(() => import("lucide-react").then((mod) => mod.Rocket)),
	Wrench: dynamic(() => import("lucide-react").then((mod) => mod.Wrench)),
	Lightbulb: dynamic(() => import("lucide-react").then((mod) => mod.Lightbulb)),
	LineChart: dynamic(() => import("lucide-react").then((mod) => mod.LineChart)),
	MessageSquare: dynamic(() =>
		import("lucide-react").then((mod) => mod.MessageSquare),
	),
	Timer: dynamic(() => import("lucide-react").then((mod) => mod.Timer)),
	Briefcase: dynamic(() => import("lucide-react").then((mod) => mod.Briefcase)),
} as const;

export function DynamicIcon({
	name,
	...props
}: LucideProps & { name: keyof typeof iconComponents }) {
	const Icon = iconComponents[name];
	return Icon ? <Icon {...props} /> : null;
}
