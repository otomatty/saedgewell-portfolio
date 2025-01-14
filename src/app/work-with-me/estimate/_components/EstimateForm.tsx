"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EstimateResult } from "./EstimateResult";
import { Textarea } from "@/components/ui/textarea";
import {
	AppWindow,
	Globe,
	Lightbulb,
	Calendar,
	Zap,
	Clock,
	CalendarClock,
	Loader2,
	Sparkles,
	Check,
	XCircle,
	Circle,
} from "lucide-react";
import {
	analyzeRequirements,
	generateRequirementsPrompt,
	calculateFeatureEstimates,
	type FeatureEstimate,
} from "@/lib/gemini";
import type { AnalysisTask } from "@/lib/gemini";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
	projectType: z.enum(["app", "web", "other"]),
	deadline: z.enum(["asap", "month1", "month3", "flexible"]),
	requirements: z.string().min(1, "具体的な要件を入力してください"),
	features: z.object({
		responsive: z.boolean(),
		animation: z.boolean(),
		cms: z.boolean(),
		auth: z.boolean(),
		api: z.boolean(),
	}),
	design: z.enum(["none", "simple", "custom"]),
	support: z.enum(["none", "basic", "premium"]),
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_VALUES: FormData = {
	projectType: "web",
	deadline: "month3",
	requirements: "",
	features: {
		responsive: false,
		animation: false,
		cms: false,
		auth: false,
		api: false,
	},
	design: "simple",
	support: "basic",
};

type FeatureSuggestion = {
	name: string;
	description: string;
	useCases: string[];
	type: keyof FormData["features"];
	required: boolean;
	estimatedTime?: string; // 実装目安時間（例: "2週間", "1ヶ月"）
};

type PageSuggestion = {
	name: string;
	description: string;
	contents: string[];
	features?: string[]; // そのページで必要になる可能性のある機能
};

export default function EstimateForm() {
	const [showResult, setShowResult] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
	const [analysis, setAnalysis] = useState<Awaited<
		ReturnType<typeof analyzeRequirements>
	> | null>(null);
	const [suggestedFeatures, setSuggestedFeatures] = useState<
		FeatureSuggestion[]
	>([]);
	const [suggestedPages, setSuggestedPages] = useState<PageSuggestion[]>([]);
	const [tasks, setTasks] = useState<AnalysisTask[]>([]);
	const [openFeatures, setOpenFeatures] = useState<Record<string, boolean>>({});
	const [featureEstimates, setFeatureEstimates] = useState<FeatureEstimate[]>(
		[],
	);
	const [isCalculating, setIsCalculating] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...INITIAL_VALUES,
			features: {
				responsive: false,
				animation: false,
				cms: false,
				auth: false,
				api: false,
			},
		},
	});

	function calculateEstimate(data: FormData) {
		let basePrice = 0;

		// プロジェクトタイプによる基本料金
		switch (data.projectType) {
			case "app":
				basePrice = 800000;
				break;
			case "web":
				basePrice = 500000;
				break;
			case "other":
				basePrice = 300000;
				break;
		}

		// 納期による調整
		switch (data.deadline) {
			case "asap":
				basePrice *= 1.5;
				break;
			case "month1":
				basePrice *= 1.2;
				break;
			case "month3":
				break;
			case "flexible":
				basePrice *= 0.9;
				break;
		}

		// 機能による追加料金
		if (data.features.responsive) basePrice += 100000;
		if (data.features.animation) basePrice += 150000;
		if (data.features.cms) basePrice += 200000;
		if (data.features.auth) basePrice += 200000;
		if (data.features.api) basePrice += 300000;

		// デザインによる追加料金
		switch (data.design) {
			case "simple":
				basePrice += 200000;
				break;
			case "custom":
				basePrice += 500000;
				break;
		}

		// サポートによる追加料金
		switch (data.support) {
			case "basic":
				basePrice += 100000;
				break;
			case "premium":
				basePrice += 300000;
				break;
		}

		return Math.round(basePrice / 10000) * 10000;
	}

	async function onSubmit(data: FormData) {
		setIsAnalyzing(true);
		setIsCalculating(true);
		try {
			const result = await analyzeRequirements(data.requirements);
			setAnalysis(result);
			if (result?.features) {
				// AIの提案を自動で反映
				const features = result.features.features.reduce(
					(acc, feature) => {
						const featureType =
							feature.name.toLowerCase() as keyof FormData["features"];
						acc[featureType] = feature.importance === "required";
						return acc;
					},
					{} as Record<keyof FormData["features"], boolean>,
				);

				type FeatureKey = keyof FormData["features"];
				for (const [key, value] of Object.entries(features)) {
					form.setValue(`features.${key as FeatureKey}`, value);
				}

				// 選択された機能の見積もりを計算
				const selectedFeatures = result.features.features
					.filter((feature) => {
						const featureType =
							feature.name.toLowerCase() as keyof FormData["features"];
						return form.getValues(`features.${featureType}`);
					})
					.map((feature) => ({
						name: feature.name,
						type: feature.name.toLowerCase(),
						description: feature.description,
					}));

				const estimates = await calculateFeatureEstimates(
					data.requirements,
					selectedFeatures,
				);
				setFeatureEstimates(estimates);
			}
		} catch (error) {
			console.error("Analysis error:", error);
		} finally {
			setIsAnalyzing(false);
			setIsCalculating(false);
		}
	}

	function getFeatureDescription(feature: string): string {
		switch (feature) {
			case "responsive":
				return "スマートフォンやタブレットなど、様々な画面サイズに対応";
			case "animation":
				return "ユーザー体験を向上させる洗練されたアニメーション効果";
			case "cms":
				return "コンテンツを簡単に更新・管理できるシステム";
			case "auth":
				return "ユーザー認証やアカウント管理機能";
			case "api":
				return "外部サービスとのデータ連携";
			default:
				return "";
		}
	}

	// AIによる分析を取得
	async function analyzeFeaturesOnly() {
		const requirements = form.getValues("requirements");
		const projectType = form.getValues("projectType");
		if (!requirements) return;

		setIsAnalyzing(true);
		try {
			const result = await analyzeRequirements(
				requirements,
				projectType,
				(task) => {
					setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
				},
			);
			if (result) {
				if (projectType === "web") {
					setSuggestedPages(result.pages || []);
					setSuggestedFeatures([]);
				} else {
					// アプリの場合は機能を分析
					const suggestions = (result.features?.features || []).map(
						(feature) => ({
							name: feature.name,
							description: feature.description,
							useCases: feature.useCases || [],
							type: feature.name as keyof FormData["features"],
							required: feature.importance === "required",
						}),
					);

					// 必須機能は自動で選択
					const requiredFeatures = suggestions.filter(
						(feature: FeatureSuggestion) => feature.required,
					);
					for (const feature of requiredFeatures) {
						const key = feature.type;
						if (key in form.getValues().features) {
							form.setValue(
								`features.${key}` as
									| "features.responsive"
									| "features.animation"
									| "features.cms"
									| "features.auth"
									| "features.api",
								true,
							);
						}
					}

					setSuggestedFeatures(suggestions);
					setSuggestedPages([]);
				}
			}
		} catch (error) {
			console.error("Analysis error:", error);
		} finally {
			setIsAnalyzing(false);
		}
	}

	// 機能の選択を処理する関数
	const handleFeatureSelect = (feature: FeatureSuggestion) => {
		if (!feature.required) {
			// 必須でない場合のみ選択可能
			const currentValue = form.getValues(`features.${feature.type}`);
			form.setValue(`features.${feature.type}`, !currentValue, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	// 提案された機能カードのレンダリング
	const renderFeatureCard = (feature: FeatureSuggestion) => {
		const isSelected = form.watch(`features.${feature.type}`);

		return (
			<div className="relative" key={feature.name}>
				<div className="rounded-lg border bg-card p-4 transition-all hover:border-primary/50">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="flex flex-col items-start gap-1">
								<div className="flex items-center gap-2">
									<span className="text-lg font-medium">{feature.name}</span>
									{feature.required && (
										<span className="text-xs text-primary">必須機能</span>
									)}
								</div>
								<span className="text-sm text-muted-foreground">
									{feature.description}
								</span>
								{feature.estimatedTime && (
									<span className="text-xs text-muted-foreground mt-2">
										実装目安：約{feature.estimatedTime}
									</span>
								)}
							</div>
						</div>
						<Switch
							checked={isSelected || feature.required}
							onCheckedChange={() => handleFeatureSelect(feature)}
							disabled={feature.required}
							className="mt-1"
						/>
					</div>
				</div>
			</div>
		);
	};

	// プロンプト生成
	async function generatePrompt() {
		const projectType = form.getValues("projectType");
		const currentRequirements = form.getValues("requirements");

		if (!currentRequirements.trim()) {
			form.setError("requirements", {
				type: "manual",
				message: "要件を入力してください",
			});
			return;
		}

		setIsGeneratingPrompt(true);
		try {
			const result = await generateRequirementsPrompt(
				projectType,
				currentRequirements,
			);
			if (result) {
				form.setValue("requirements", result, {
					shouldValidate: true,
					shouldDirty: true,
				});
			} else {
				form.setError("requirements", {
					type: "manual",
					message: "要件の分析中にエラーが発生しました",
				});
			}
		} catch (error) {
			console.error("Prompt generation error:", error);
			form.setError("requirements", {
				type: "manual",
				message: "要件の分析中にエラーが発生しました",
			});
		} finally {
			setIsGeneratingPrompt(false);
		}
	}

	return (
		<div className="space-y-8">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
					{/* プロジェクトタイプ選択 */}
					<FormField
						control={form.control}
						name="projectType"
						render={({ field }) => (
							<FormItem className="space-y-4">
								<FormLabel className="text-lg font-semibold">
									プロジェクトの種類
								</FormLabel>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{[
										{
											value: "app",
											label: "アプリ開発",
											icon: AppWindow,
											description: "Webアプリケーション・管理画面など",
										},
										{
											value: "web",
											label: "Webサイト制作",
											icon: Globe,
											description: "コーポレートサイト・ランディングページなど",
										},
										{
											value: "other",
											label: "その他",
											icon: Lightbulb,
											description: "上記以外のご相談",
										},
									].map((type) => (
										<button
											type="button"
											key={type.value}
											className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary hover:shadow-lg ${
												field.value === type.value
													? "border-primary bg-primary/5 shadow-primary/20"
													: "hover:bg-muted"
											}`}
											onClick={() => field.onChange(type.value)}
										>
											<div className="flex flex-col items-center text-center gap-4">
												<type.icon className="h-8 w-8 text-primary" />
												<div>
													<div className="font-semibold mb-2">{type.label}</div>
													<div className="text-sm text-muted-foreground">
														{type.description}
													</div>
												</div>
											</div>
										</button>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 開発期間選択 - デザイン更新 */}
					<FormField
						control={form.control}
						name="deadline"
						render={({ field }) => (
							<FormItem className="space-y-4">
								<FormLabel className="text-lg font-semibold">
									希望納期
								</FormLabel>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									{[
										{
											value: "asap",
											label: "できるだけ早く",
											icon: Zap,
											description: "1ヶ月以内",
										},
										{
											value: "month1",
											label: "1ヶ月以内",
											icon: Clock,
											description: "通常の開発スピード",
										},
										{
											value: "month3",
											label: "3ヶ月以内",
											icon: Calendar,
											description: "じっくり開発",
										},
										{
											value: "flexible",
											label: "相談して決めたい",
											icon: CalendarClock,
											description: "柔軟に対応可能",
										},
									].map((deadline) => (
										<button
											type="button"
											key={deadline.value}
											className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary hover:shadow-lg ${
												field.value === deadline.value
													? "border-primary bg-primary/5 shadow-primary/20"
													: "hover:bg-muted"
											}`}
											onClick={() => field.onChange(deadline.value)}
										>
											<div className="flex flex-col items-center text-center gap-4">
												<deadline.icon className="h-8 w-8 text-primary" />
												<div>
													<div className="font-semibold mb-2">
														{deadline.label}
													</div>
													<div className="text-sm text-muted-foreground">
														{deadline.description}
													</div>
												</div>
											</div>
										</button>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* 要件入力 */}
					<FormField
						control={form.control}
						name="requirements"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									具体的な要件
								</FormLabel>
								<div className="space-y-4">
									<div className="flex justify-end">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={generatePrompt}
											disabled={isGeneratingPrompt}
										>
											{isGeneratingPrompt ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													AIが要件を詳細化中...
												</>
											) : (
												<>
													<Sparkles className="mr-2 h-4 w-4" />
													AIで要件を詳細化
												</>
											)}
										</Button>
									</div>
									<div className="relative">
										<FormControl>
											<Textarea
												{...field}
												placeholder={`以下のような内容を具体的にご記入ください：

• プロジェクトの目的や背景
例）ECサイトを作りたい、社内の業務効率化のためのツールが必要

• 主な機能やページ
例）商品一覧・詳細ページ、会員登録・ログイン機能、管理画面

• 特に重視する点
例）スマートフォンでの使いやすさ、更新のしやすさ、セキュリティ

• 参考にしたいサイトやアプリ
例）〇〇のようなデザイン、××のような使い勝手`}
												className="min-h-[300px] p-6 text-lg rounded-xl resize-none"
											/>
										</FormControl>
										<Sparkles className="absolute top-4 right-4 h-5 w-5 text-primary/50" />
									</div>
									<FormDescription className="text-sm mt-4">
										できるだけ具体的にご記入いただくことで、AIがより正確な提案と見積もりを行えます
									</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* AI分析ボタン */}
					<Button
						type="button"
						variant="outline"
						size="lg"
						className="w-full text-lg h-16 rounded-xl"
						onClick={analyzeFeaturesOnly}
						disabled={isAnalyzing || !form.getValues("requirements")}
					>
						{isAnalyzing ? (
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								AIが要件を分析中...
							</>
						) : (
							<>
								<Sparkles className="mr-2 h-5 w-5" />
								AIで必要な機能を分析
							</>
						)}
					</Button>

					{/* 提案されたページの表示 */}
					{suggestedPages.length > 0 && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">AIが提案するページ構成</h3>
							<div className="grid gap-4">
								{suggestedPages.map((page) => (
									<div
										key={page.name}
										className="p-6 rounded-xl border bg-card hover:shadow-md transition-all"
									>
										<h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
											<Sparkles className="h-4 w-4 text-primary" />
											{page.name}
										</h4>
										<p className="text-muted-foreground mb-4">
											{page.description}
										</p>
										<div className="space-y-4">
											<div>
												<p className="font-medium text-sm">掲載コンテンツ：</p>
												<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
													{page.contents.map((content) => (
														<li key={content}>{content}</li>
													))}
												</ul>
											</div>
											{page.features && page.features.length > 0 && (
												<div>
													<p className="font-medium text-sm">推奨機能：</p>
													<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
														{page.features.map((feature) => (
															<li key={feature}>{feature}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* 提案された機能の表示 */}
					{suggestedFeatures.length > 0 && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">AIが提案する必要な機能</h3>
							<div className="grid gap-4">
								{suggestedFeatures.map((feature) => renderFeatureCard(feature))}
							</div>
							{/* 見積もり計算ボタン */}
							<Button
								type="submit"
								size="lg"
								className="w-full text-lg h-16 rounded-xl mt-8"
								disabled={isAnalyzing || isCalculating}
							>
								{isCalculating ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										見積もりを計算中...
									</>
								) : (
									<>
										<Sparkles className="mr-2 h-5 w-5" />
										見積もりを計算する
									</>
								)}
							</Button>
						</div>
					)}
				</form>
			</Form>

			{/* 見積もり結果の表示 */}
			{featureEstimates.length > 0 && (
				<EstimateResult estimates={featureEstimates} />
			)}

			{/* 分析タスクの状態表示 */}
			{isAnalyzing && (
				<div className="space-y-4">
					{tasks.map((task) => (
						<div
							key={task.id}
							className="flex items-center gap-4 p-4 rounded-lg border bg-card"
						>
							{task.status === "running" ? (
								<Loader2 className="h-4 w-4 animate-spin text-primary" />
							) : task.status === "completed" ? (
								<Check className="h-4 w-4 text-green-500" />
							) : task.status === "error" ? (
								<XCircle className="h-4 w-4 text-red-500" />
							) : (
								<Circle className="h-4 w-4 text-muted-foreground" />
							)}
							<div>
								<p className="font-medium">{task.name}</p>
								<p className="text-sm text-muted-foreground">
									{task.description}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
