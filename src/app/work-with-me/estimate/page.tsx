import type { Metadata } from "next";
import EstimateForm from "./_components/EstimateForm";

export const metadata: Metadata = {
	title: "自動見積もり | Work With Me",
	description:
		"プロジェクトの要件を入力して、概算見積もりを自動で取得できます。",
};

export default function EstimatePage() {
	return (
		<div className="min-h-screen py-20">
			<div className="container max-w-3xl">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">自動見積もり</h1>
					<p className="text-muted-foreground">
						以下のフォームに必要事項を入力いただくと、概算の見積もり金額を自動で算出いたします。
					</p>
				</div>

				<EstimateForm />
			</div>
		</div>
	);
}
