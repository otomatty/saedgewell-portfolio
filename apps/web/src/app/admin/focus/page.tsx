import type { Metadata } from "next";
import FocusTimer from "./_components/focus-timer/focus-timer";
import { getTodaysFocusSessions } from "../../../_actions/focus";

export const metadata: Metadata = {
	title: "Focus | Admin",
	description: "Focus timer for productivity",
};

export default async function FocusPage() {
	// 初期データの取得
	const initialSessions = await getTodaysFocusSessions();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-8">Focus Timer</h1>
			<FocusTimer initialSessions={initialSessions} />
		</div>
	);
}
