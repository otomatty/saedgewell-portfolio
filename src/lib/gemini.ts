import { GoogleGenerativeAI } from "@google/generative-ai";

type FeatureSuggestion = {
	responsive: boolean;
	animation: boolean;
	cms: boolean;
	auth: boolean;
	api: boolean;
	reasoning: string;
};

type EstimateDetails = {
	timeEstimate: {
		min: number; // 月数
		max: number; // 月数
		reasoning: string;
	};
	costEstimate: {
		min: number; // 円
		max: number; // 円
		reasoning: string;
	};
};

type PageSuggestion = {
	name: string;
	description: string;
	contents: string[];
	features?: string[];
};

// タスクの種類を定義
export type AnalysisTask = {
	id: string;
	name: string;
	description: string;
	status: "pending" | "running" | "completed" | "error";
	result?: AnalysisResults[keyof AnalysisResults];
};

// 分析タスクを定義
const ANALYSIS_TASKS = [
	{
		id: "requirements",
		name: "要件分析",
		description: "プロジェクトの要件を分析中...",
	},
	{
		id: "features",
		name: "機能提案",
		description: "必要な機能を検討中...",
	},
	{
		id: "pages",
		name: "ページ構成",
		description: "最適なページ構成を検討中...",
	},
	{
		id: "estimate",
		name: "見積もり",
		description: "開発期間と費用を算出中...",
	},
] as const;

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
	throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(API_KEY);

function cleanJsonResponse(text: string): string {
	try {
		// 最初の [ または { から最後の ] または } までの部分を抽出
		const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
		if (!jsonMatch) {
			console.error("No JSON structure found in response");
			return "[]";
		}
		let cleaned = jsonMatch[0];

		// コードブロックの削除
		cleaned = cleaned.replace(/```json\s*|\s*```/g, "");
		// バッククォートの削除
		cleaned = cleaned.replace(/`/g, "");
		// コメントの削除
		cleaned = cleaned.replace(/\/\/.*/g, "");
		// 余分な空白と改行を削除
		cleaned = cleaned.replace(/\s+/g, " ").trim();
		// シングルクォートをダブルクォートに変換
		cleaned = cleaned.replace(/'/g, '"');
		// プロパティ名をダブルクォートで囲む
		cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
		// 末尾のカンマを削除
		cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");
		// 数値の前後の不要なクォートを削除
		cleaned = cleaned.replace(/"(-?\d+(\.\d+)?)"(?=\s*[,}])/g, "$1");

		// 最終的なJSONの妥当性チェック
		JSON.parse(cleaned); // テスト用にパース
		return cleaned;
	} catch (error) {
		console.error("Error cleaning JSON response:", error);
		return "[]";
	}
}

export async function suggestFeatures(
	requirements: string,
): Promise<FeatureSuggestion | null> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

		const prompt = `
		あなたはJSON形式でのみ応答するAPIです。
		以下のプロジェクト要件を分析し、必要な機能を判断してください。

		要件：
		${requirements}

		応答は必ず以下のJSON形式のみとし、余分なテキストは含めないでください：
		{
			"responsive": boolean,
			"animation": boolean,
			"cms": boolean,
			"auth": boolean,
			"api": boolean,
			"reasoning": string
		}
		`;

		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		return JSON.parse(text) as FeatureSuggestion;
	} catch (error) {
		console.error("Gemini API error:", error);
		return null;
	}
}

export async function generateEstimateDetails(
	requirements: string,
	features: FeatureSuggestion,
): Promise<EstimateDetails | null> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

		const prompt = `
		以下のプロジェクト要件と必要な機能に基づいて、開発期間と費用の見積もりを行ってください。

		プロジェクト要件：
		${requirements}

		必要な機能：
		- レスポンシブ対応: ${features.responsive ? "必要" : "不要"}
		- アニメーション実装: ${features.animation ? "必要" : "不要"}
		- CMS機能: ${features.cms ? "必要" : "不要"}
		- 認証機能: ${features.auth ? "必要" : "不要"}
		- API連携: ${features.api ? "必要" : "不要"}

		追加の考慮事項：
		${features.reasoning}

		以下の形式で回答してください（JSONのみを返してください）：
		{
			"timeEstimate": {
				"min": number,
				"max": number,
				"reasoning": string
			},
			"costEstimate": {
				"min": number,
				"max": number,
				"reasoning": string
			}
		}
		`;

		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		return JSON.parse(text) as EstimateDetails;
	} catch (error) {
		console.error("Gemini API error:", error);
		return null;
	}
}

export async function analyzePagesForWebsite(
	requirements: string,
): Promise<PageSuggestion[] | null> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

		const prompt = `
		以下のWebサイト要件に基づいて、必要なページ構成を日本語で提案してください。
		できるだけ多くのページを提案してください（最低10ページ）。
		各ページについて、以下の情報を含めてください：
		- ページ名（日本語で、シンプルで分かりやすい名前）
		- ページの簡潔な説明（日本語で1-2文程度）
		- 掲載すべき主要コンテンツ（日本語で箇条書き3-5項目）
		- 推奨される機能（任意、日本語でシンプルな機能名を1-2個）

		要件：
		${requirements}

		応答例：
		[
			{
				"name": "お問い合わせページ",
				"description": "ユーザーからの問い合わせを受け付けるフォームページ",
				"contents": [
					"問い合わせフォーム",
					"よくある質問へのリンク",
					"営業時間案内"
				],
				"features": ["フォームバリデーション", "自動返信メール"]
			}
		]

		応答は必ず上記のJSON形式のみとし、余分なテキストは含めないでください。
		`;

		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		return JSON.parse(text) as PageSuggestion[];
	} catch (error) {
		console.error("Gemini API error:", error);
		return null;
	}
}

// 機能の型定義を更新
type Feature = {
	name: string;
	description: string;
	importance: "required" | "recommended" | "optional";
	estimatedTime: string;
	useCases?: string[];
};

type AnalysisResult = {
	features: Feature[];
	reasoning: string;
};

// 機能の細分化を行う関数
async function refineFeatures(features: Feature[]): Promise<Feature[]> {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
	あなたはシステム設計のエキスパートとして、以下の機能リストを分析し、
	それぞれの機能が十分に具体的かどうかを判断し、必要に応じてより詳細な機能に分解してください。

	現在の機能リスト：
	${JSON.stringify(features, null, 2)}

	以下の基準で機能を評価し、必要に応じて細分化してください：

	評価基準：
	1. 機能の範囲が明確か
	2. 実装に必要な要素が具体的か
	3. 単一の責任原則に従っているか
	4. 工数見積もりが可能な粒度か
	5. テスト可能な単位か

	細分化が必要な場合は、以下の点を考慮してください：
	1. 各サブ機能は独立して実装・テスト可能であること
	2. 元の機能の目的を保持していること
	3. より具体的な実装内容を示すこと
	4. 適切な粒度に分割すること

	応答は必ず以下のJSON形式のみとし、余分なテキストは含めないでください：
	{
		"features": [
			{
				"name": "機能名",
				"description": "具体的な機能の説明",
				"importance": "required" | "recommended" | "optional",
				"estimatedTime": "実装時間の見積もり",
				"useCases": ["利用シナリオ1", "利用シナリオ2"]
			}
		]
	}

	応答例：
	元の機能が "ユーザー管理" の場合：
	{
		"features": [
			{
				"name": "ユーザー登録フォーム",
				"description": "メールアドレスとパスワードによる新規ユーザー登録機能",
				"importance": "required",
				"estimatedTime": "2日",
				"useCases": [
					"新規ユーザーがメールアドレスとパスワードで登録する",
					"登録時にメール確認を行う"
				]
			}
		]
	}
	`;

	try {
		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		const refinedFeatures = JSON.parse(text);
		return refinedFeatures.features;
	} catch (error) {
		console.error("Error refining features:", error);
		return features;
	}
}

export async function analyzeFeatures(
	requirements: string,
): Promise<AnalysisResult> {
	const prompt = `
	あなたはWebアプリケーションアーキテクトです。
	以下のプロジェクト要件を分析し、必要な機能を日本語で提案してください。
	できるだけ多くの機能（最低20個）を提案してください。

	要件：
	${requirements}

	各機能について以下の情報を含めてJSON形式で回答してください：
	- name: 機能名（日本語で、シンプルで分かりやすい名前）
	- description: 機能の簡潔な説明（日本語で1-2文程度）
	- importance: 重要度（"required" | "recommended" | "optional"）
	- estimatedTime: 実装に必要な時間の見積もり（例: "2日", "3日"）
	- useCases: 具体的な利用シナリオ（配列で3つ程度）

	応答例：
	{
		"features": [
			{
				"name": "ユーザー認証",
				"description": "メールアドレスとパスワードによるログイン機能",
				"importance": "required",
				"estimatedTime": "2日",
				"useCases": [
					"ユーザーがメールアドレスとパスワードでログインする",
					"パスワードを忘れた場合にリセットする",
					"ログアウトする"
				]
			}
		],
		"reasoning": "提案理由を日本語で説明"
	}

	応答は必ず上記のJSON形式のみとし、余分なテキストは含めないでください。
	`;

	const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
	const result = await model.generateContent(prompt);
	const text = cleanJsonResponse(result.response.text());
	const initialAnalysis = JSON.parse(text) as AnalysisResult;

	// 機能の細分化を実行
	const refinedFeatures = await refineFeatures(initialAnalysis.features);

	return {
		features: refinedFeatures,
		reasoning: initialAnalysis.reasoning,
	};
}

export async function analyzeProjectRequirements(requirements: string) {
	const prompt = `
	あなたはプロジェクトマネージャーです。
	以下のプロジェクト要件を分析し、主要なポイントを抽出してください。

	要件：
	${requirements}

	応答は必ず以下のJSON形式のみとし、余分なテキストは含めないでください：
	{
		"summary": string, // 要件の要約
		"objectives": string[], // プロジェクトの目的
		"constraints": string[], // 制約条件
		"keyPoints": string[], // 重要なポイント
		"risks": string[], // 潜在的なリスク
		"recommendations": string[] // 推奨事項
	}
	`;

	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const result = await model.generateContent(prompt);
	const text = cleanJsonResponse(result.response.text());
	return JSON.parse(text);
}

type AnalysisResults = {
	requirements?: {
		summary: string;
		objectives: string[];
		constraints: string[];
		keyPoints: string[];
		risks: string[];
		recommendations: string[];
	};
	features?: {
		features: Feature[];
		reasoning: string;
	};
	pages?: PageSuggestion[];
	estimates?: EstimateDetails;
};

export async function analyzeRequirements(
	requirements: string,
	projectType = "app",
	onTaskUpdate?: (task: AnalysisTask) => void,
) {
	const tasks = [...ANALYSIS_TASKS];
	const results: AnalysisResults = {};

	for (const task of tasks) {
		if (onTaskUpdate) {
			onTaskUpdate({ ...task, status: "running" });
		}

		try {
			switch (task.id) {
				case "requirements": {
					const result = await analyzeProjectRequirements(requirements);
					if (result) results.requirements = result;
					break;
				}
				case "features": {
					const result = await analyzeFeatures(requirements);
					if (result) results.features = result;
					break;
				}
				case "pages": {
					if (projectType === "web") {
						const result = await analyzePagesForWebsite(requirements);
						if (result) results.pages = result;
					}
					break;
				}
				case "estimate": {
					if (results.features) {
						const result = await generateEstimateDetails(
							requirements,
							results.features as unknown as FeatureSuggestion,
						);
						if (result) results.estimates = result;
					}
					break;
				}
			}

			if (onTaskUpdate) {
				onTaskUpdate({
					...task,
					status: "completed",
					result:
						task.id === "requirements"
							? results.requirements
							: task.id === "features"
								? results.features
								: task.id === "pages"
									? results.pages
									: task.id === "estimate"
										? results.estimates
										: undefined,
				});
			}
		} catch (error) {
			console.error(`Error in task ${task.id}:`, error);
			if (onTaskUpdate) {
				onTaskUpdate({ ...task, status: "error" });
			}
			return null;
		}
	}

	return results;
}

export async function generateRequirementsPrompt(
	projectType: string,
	currentRequirements: string,
): Promise<string | null> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });

		const prompt = `
		あなたは要件定義のエキスパートです。
		以下の${projectType === "web" ? "Webサイト" : "アプリケーション"}の要件について、機能要件とユースケースの観点から具体化・詳細化してください。

		現在の要件：
		${currentRequirements}

		上記の要件について、以下の観点から具体化・詳細化してください：

		1. 機能要件の詳細化
		- 記載されている各機能について、具体的な操作フローを追加
		- 必要な入力項目や表示項目の具体例を追加
		- 機能間の関連性や依存関係を明確化

		2. ユースケースの具体化
		- 記載されている利用シーンについて、より具体的なシナリオを追加
		- 想定されるユーザーの行動パターンを詳細化
		- エッジケースや例外パターンの考慮

		3. データ要件の明確化
		- 必要なデータ項目の具体化
		- データの入力・更新・削除のタイミングの明確化
		- データ間の関連性や制約条件の追加

		未記載の項目については、一般的なユースケースを例示して補完してください。
		元の要件の意図を保ちながら、より具体的で実装可能な形に強化してください。
		`;

		const result = await model.generateContent(prompt);
		return result.response.text();
	} catch (error) {
		console.error("Gemini API error:", error);
		return null;
	}
}

export type FeatureEstimate = {
	name: string;
	timeEstimate: {
		min: number; // 週数
		max: number; // 週数
	};
	costEstimate: {
		min: number; // 円
		max: number; // 円
	};
	complexity: "low" | "medium" | "high";
	notes?: string;
};

export async function calculateFeatureEstimates(
	requirements: string,
	selectedFeatures: Array<{
		name: string;
		type: string;
		description: string;
	}>,
): Promise<FeatureEstimate[]> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });

		const prompt = `
		あなたはJSON形式でのみ応答するAPIとして機能します。
		以下のプロジェクト要件と選択された機能に基づいて、1人で実装する場合の工数と費用を見積もってください。

		プロジェクト要件：
		${requirements}

		選択された機能：
		${selectedFeatures.map((f) => `- ${f.name}: ${f.description}`).join("\n")}

		見積もりの基準：
		1. 時間は日単位で見積もる（1機能あたり0.5日～5日程度を目安）
		2. 簡単な機能は数時間（0.5日）で実装できることを考慮
		3. 費用は個人開発者の単価を考慮（1人月50万円を基準 = 1日あたり約2.5万円）
		4. 1機能あたりの費用は1.25万円（0.5日）～12.5万円（5日）の範囲で見積もる

		以下のJSON形式で厳密に応答してください：
		[
			{
				"name": "機能名",
				"timeEstimate": {
					"min": 0.5,
					"max": 2
				},
				"costEstimate": {
					"min": 12500,
					"max": 50000
				},
				"complexity": "low",
				"notes": "実装方針の説明"
			}
		]

		応答の制約：
		1. 必ず配列形式で返すこと
		2. すべてのプロパティ名をダブルクォートで囲むこと（例: "name", "timeEstimate"）
		3. 文字列値はダブルクォートで囲むこと（例: "機能名", "low"）
		4. 数値は引用符で囲まないこと（例: 0.5, 12500）
		5. complexityは必ず "low", "medium", "high" のいずれかを使用すること
		6. 配列の最後の要素の後にカンマを付けないこと
		7. プロパティの最後の要素の後にカンマを付けないこと
		8. 余分な空白や改行を含めないこと
		9. コメントや説明を含めないこと
		10. JSON以外のテキストを一切含めないこと

		応答例：
		[{"name":"ユーザー認証","timeEstimate":{"min":0.5,"max":2},"costEstimate":{"min":12500,"max":50000},"complexity":"low","notes":"既存の認証ライブラリを使用して実装"}]
		`;

		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		try {
			const parsed = JSON.parse(text) as FeatureEstimate[];
			console.log("Raw response:", result.response.text()); // デバッグ用
			console.log("Cleaned JSON text:", text); // デバッグ用
			console.log("Parsed estimates:", parsed); // デバッグ用
			return parsed;
		} catch (parseError) {
			console.error("JSON parse error. Raw text:", text);
			throw parseError;
		}
	} catch (error) {
		console.error("Feature estimation error:", error);
		return [];
	}
}

// 機能分析の結果の型定義
type FeatureAnalysisResult = {
	features: Array<{
		name: string;
		description: string;
		importance: "required" | "recommended" | "optional";
		estimatedTime: string;
	}>;
	reasoning: string;
};

// 必須機能の数と選択可能な機能の数を比較し、必要に応じて追加の機能を提案する
export async function analyzeAndAugmentFeatures(
	requirements: string,
	currentFeatures: FeatureAnalysisResult,
): Promise<FeatureAnalysisResult> {
	const requiredFeatures = currentFeatures.features.filter(
		(f) => f.importance === "required",
	);
	const selectableFeatures = currentFeatures.features.filter(
		(f) => f.importance !== "required",
	);

	// 選択可能な機能が必須機能と同数以上あるかチェック
	if (selectableFeatures.length >= requiredFeatures.length) {
		return currentFeatures;
	}

	// 追加の機能を提案するプロンプト
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const prompt = `
	以下のプロジェクト要件と既存の機能リストを分析し、さらに追加で実装可能な機能を提案してください。
	現在の必須機能数: ${requiredFeatures.length}
	現在の選択可能な機能数: ${selectableFeatures.length}
	少なくとも ${requiredFeatures.length - selectableFeatures.length} 個の新しい機能を提案してください。

	プロジェクト要件：
	${requirements}

	既存の機能リスト：
	${JSON.stringify(currentFeatures.features, null, 2)}

	以下の点を考慮して機能を提案してください：
	1. ユーザー体験を向上させる機能
	2. 運用効率を改善する機能
	3. 差別化につながる機能
	4. 実装が比較的容易な機能
	5. 既存の機能と重複しない機能

	応答は必ず以下のJSON形式のみとし、余分なテキストは含めないでください：
	{
		"features": [
			{
				"name": "機能名",
				"description": "機能の説明",
				"importance": "recommended",
				"estimatedTime": "実装時間の見積もり"
			}
		]
	}
	`;

	try {
		const result = await model.generateContent(prompt);
		const text = cleanJsonResponse(result.response.text());
		const additionalFeatures = JSON.parse(text);

		// 既存の機能リストに新しい機能を追加
		return {
			...currentFeatures,
			features: [...currentFeatures.features, ...additionalFeatures.features],
		};
	} catch (error) {
		console.error("Error augmenting features:", error);
		return currentFeatures;
	}
}
