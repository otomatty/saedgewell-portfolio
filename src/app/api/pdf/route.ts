import { type NextRequest, NextResponse } from "next/server";
import {
	generatePDF,
	renderPDFTemplate,
} from "@/app/(public)/services/estimate/_utils/pdf/generatePDF";
import type { EstimateFormData } from "@/app/(public)/services/estimate/_types/estimate";

export async function POST(request: NextRequest) {
	try {
		const data = (await request.json()) as EstimateFormData;

		// HTMLテンプレートを生成
		const html = await renderPDFTemplate(data);

		// PDFを生成
		const pdf = await generatePDF(html);

		// レスポンスヘッダーを設定
		const headers = new Headers();
		headers.set("Content-Type", "application/pdf");
		headers.set("Content-Disposition", "attachment; filename=estimate.pdf");

		// PDFを返す
		return new NextResponse(pdf, {
			status: 200,
			headers,
		});
	} catch (error) {
		console.error("PDF generation error:", error);
		return NextResponse.json(
			{ error: "PDFの生成に失敗しました" },
			{ status: 500 },
		);
	}
}
