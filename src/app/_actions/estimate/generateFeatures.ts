"use server";

import { generateGeminiResponse } from "@/lib/gemini/client";
import {
	generateFeaturePrompt,
	generateRequiredFeaturesPrompt,
	generateEstimationPrompt,
} from "@/lib/gemini/prompts/feature";
import type {
	EstimateFormData,
	FeatureProposal,
} from "@/app/services/estimate/_types/estimate";

interface GeneratedFeature {
	id: string;
	name: string;
	description: string;
	category: "core" | "user" | "auth" | "content" | "payment" | "other";
	dependencies?: string[];
}

interface RequiredFeatureResult {
	id: string;
	isRequired: boolean;
	reason: string;
}

interface EstimationResult {
	id: string;
	difficulty: number;
	duration: number;
	dailyRate: number;
	price: number;
	difficultyReason: string;
}

interface GenerateFeaturesResult {
	features: FeatureProposal[];
	status: {
		step: number;
		message: string;
		completed: boolean;
	};
}

export async function generateFeatures(
	formData: EstimateFormData,
): Promise<GenerateFeaturesResult> {
	try {
		// 1. 機能の生成
		const prompt = generateFeaturePrompt(formData);
		const response = await generateGeminiResponse(prompt);
		const { features } = JSON.parse(response) as {
			features: GeneratedFeature[];
		};

		// 2. 必須機能の判定
		const requiredFeaturesPrompt = generateRequiredFeaturesPrompt(features);
		const requiredFeaturesResponse = await generateGeminiResponse(
			requiredFeaturesPrompt,
		);
		const { features: requiredFeatures } = JSON.parse(
			requiredFeaturesResponse,
		) as { features: RequiredFeatureResult[] };

		// 必須判定を適用した中間結果
		const featuresWithRequired = features.map((feature) => {
			const requiredFeature = requiredFeatures.find(
				(rf) => rf.id === feature.id,
			);
			return {
				...feature,
				isRequired: requiredFeature?.isRequired ?? false,
				reason: requiredFeature?.reason,
			};
		});

		// 3. 開発期間と費用の見積もり
		const estimationPrompt = generateEstimationPrompt(featuresWithRequired);
		const estimationResponse = await generateGeminiResponse(estimationPrompt);
		const { features: estimatedFeatures } = JSON.parse(estimationResponse) as {
			features: EstimationResult[];
		};

		// 最終結果のマージ
		const mergedFeatures = featuresWithRequired.map((feature) => {
			const estimatedFeature = estimatedFeatures.find(
				(ef) => ef.id === feature.id,
			);
			return {
				...feature,
				difficulty: estimatedFeature?.difficulty,
				duration: estimatedFeature?.duration ?? 0,
				dailyRate: estimatedFeature?.dailyRate ?? 0,
				price: estimatedFeature?.price ?? 0,
				difficultyReason: estimatedFeature?.difficultyReason,
			};
		});

		// 全ステップ完了
		return {
			features: mergedFeatures,
			status: {
				step: 3,
				message: "開発期間と開発費用の検討が完了しました",
				completed: true,
			},
		};
	} catch (error) {
		console.error("Error generating features:", error);
		throw error;
	}
}
