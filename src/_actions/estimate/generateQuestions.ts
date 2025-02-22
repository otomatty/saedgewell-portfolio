"use server";

import { generateGeminiResponse } from "@/lib/gemini/client";
import { generateQuestionPrompt } from "@/lib/gemini/prompts/question";
import type {
	AIQuestion,
	EstimateFormData,
} from "@/app/(public)/services/estimate/_types/estimate";

export async function generateQuestions(
	formData: EstimateFormData,
): Promise<AIQuestion[]> {
	try {
		const prompt = generateQuestionPrompt(formData);
		const response = await generateGeminiResponse(prompt);
		const { questions } = JSON.parse(response);

		return questions.map((q: AIQuestion) => ({
			...q,
			isAnswered: false,
			answer: "",
			skipped: false,
		}));
	} catch (error) {
		console.error("Error generating questions:", error);
		throw error;
	}
}
