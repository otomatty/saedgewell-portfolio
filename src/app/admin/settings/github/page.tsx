import type { Metadata } from "next";
import { GitHubSettingsForm } from "./_components/github-settings-form";

export const metadata: Metadata = {
	title: "GitHub設定",
	description: "GitHub連携の設定を行います。",
};

export default function GitHubSettingsPage() {
	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">GitHub設定</h1>
			<GitHubSettingsForm />
		</div>
	);
}
