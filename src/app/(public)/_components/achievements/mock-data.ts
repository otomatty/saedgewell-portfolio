import type { FeaturedWork } from "@/types/work";

export const mockWorks: FeaturedWork[] = [
	{
		id: "1",
		title: "AI搭載型営業支援SaaS",
		description:
			"AIを活用した営業活動の効率化と売上向上を支援するSaaSプラットフォーム。商談の自動記録、顧客行動分析、次のアクションの提案などの機能を提供。",
		thumbnail_url: "/images/works/saas-platform.webp",
		category: "company",
		github_url: null,
		website_url: "https://example.com/sales-saas",
		details: {
			overview:
				"大手企業向けにAIを活用した営業支援SaaSプラットフォームを開発。自然言語処理とデータ分析を組み合わせて、営業活動の効率化と売上向上を実現。音声認識による商談記録の自動化、顧客行動パターンの分析、最適なアプローチ方法の提案など、先進的な機能を実装。",
			role: "テックリード / フロントエンドエンジニア",
			period: "2023年4月 - 2023年12月（9ヶ月）",
			team_size: "8名（PM: 1名、エンジニア: 5名、デザイナー: 2名）",
			technologies: [
				"Next.js",
				"TypeScript",
				"Python",
				"FastAPI",
				"PostgreSQL",
				"OpenAI API",
				"AWS",
			],
			challenges: [
				"大規模な音声データのリアルタイム処理",
				"複雑なAIモデルの運用",
				"セキュリティ要件への対応",
			],
			solutions: [
				"WebSocketを活用したストリーミング処理の実装",
				"マイクロサービスアーキテクチャの採用",
				"エンドツーエンドの暗号化システムの構築",
			],
			results: [
				"営業チームの工数を30%削減",
				"商談成約率が20%向上",
				"顧客満足度スコアが15%改善",
			],
		},
	},
	{
		id: "2",
		title: "ECサイトリニューアル",
		description: "大手ECサイトのフルリニューアル",
		thumbnail_url: "/images/works/work-2.jpg",
		category: "company",
		github_url: null,
		website_url: "https://example.com/ec-site",
		details: {
			overview:
				"年間取引額1000億円規模のECサイトのフルリニューアルプロジェクト。パフォーマンスの改善、UX/UIの刷新、新機能の追加を実施。モバイルファーストのアプローチで、レスポンシブデザインを徹底的に実装。",
			role: "フロントエンドエンジニア",
			period: "2023年1月 - 2023年6月（6ヶ月）",
			team_size: "15名（PM: 2名、エンジニア: 10名、デザイナー: 3名）",
			technologies: [
				"Next.js",
				"TypeScript",
				"GraphQL",
				"Redis",
				"AWS",
				"Stripe API",
			],
			challenges: [
				"レガシーシステムからの段階的な移行",
				"大規模トラフィックへの対応",
				"複雑な決済システムの実装",
			],
			solutions: [
				"ストラングラーパターンを採用した段階的移行",
				"CDNとキャッシュ戦略の最適化",
				"マイクロサービス化による決済システムの分離",
			],
			results: [
				"ページ読み込み時間を60%短縮",
				"モバイルコンバージョン率が25%向上",
				"システム運用コストを40%削減",
			],
		},
	},
	{
		id: "3",
		title: "スマートファクトリー管理システム",
		description: "IoTセンサーを活用した工場管理システム",
		thumbnail_url: "/images/works/smart-tech.webp",
		category: "freelance",
		github_url: null,
		website_url: null,
		details: {
			overview:
				"製造業向けのIoTセンサーを活用したスマートファクトリー管理システムの開発。リアルタイムでの生産ライン監視、予知保全、在庫管理機能を実装。データ分析による生産効率の最適化を実現。",
			role: "フルスタックエンジニア",
			period: "2022年7月 - 2022年12月（6ヶ月）",
			team_size: "6名（PM: 1名、エンジニア: 4名、データサイエンティスト: 1名）",
			technologies: [
				"React",
				"Node.js",
				"Python",
				"TensorFlow",
				"MongoDB",
				"MQTT",
				"Azure IoT Hub",
			],
			challenges: [
				"大量のセンサーデータのリアルタイム処理",
				"レガシー設備とのインテグレーション",
				"工場特有の環境への対応",
			],
			solutions: [
				"時系列データベースの採用",
				"カスタムプロトコルアダプターの開発",
				"エッジコンピューティングの活用",
			],
			results: [
				"設備稼働率が15%向上",
				"保守コストを25%削減",
				"不良品率を40%削減",
			],
		},
	},
	{
		id: "4",
		title: "医療機関向け予約システム",
		description: "オンライン診療・予約システムの開発",
		thumbnail_url: "/images/works/work-4.jpg",
		category: "freelance",
		github_url: null,
		website_url: "https://example.com/medical-booking",
		details: {
			overview:
				"医療機関向けのオンライン診療・予約システムの開発。予約管理、ビデオ通話、電子カルテ連携、決済機能を実装。医療機関と患者双方の利便性を向上させるUX設計を重視。",
			role: "フロントエンドエンジニア",
			period: "2022年1月 - 2022年6月（6ヶ月）",
			team_size: "10名（PM: 1名、エンジニア: 7名、デザイナー: 2名）",
			technologies: [
				"Next.js",
				"TypeScript",
				"WebRTC",
				"Firebase",
				"Stripe",
				"FHIR",
			],
			challenges: [
				"医療情報の厳格なセキュリティ要件",
				"複雑な予約ロジックの実装",
				"レガシー医療システムとの連携",
			],
			solutions: [
				"HIPAA準拠のセキュリティ設計",
				"カスタムスケジューリングエンジンの開発",
				"標準規格FHIRの採用",
			],
			results: [
				"予約業務の工数を50%削減",
				"患者の待ち時間を60%短縮",
				"オンライン診療の利用率が200%増加",
			],
		},
	},
	{
		id: "5",
		title: "フィンテックアプリケーション",
		description: "ブロックチェーンを活用した決済システム",
		thumbnail_url: "/images/works/work-5.jpg",
		category: "personal",
		github_url: "https://github.com/example/fintech-app",
		website_url: "https://example.com/fintech-app",
		details: {
			overview:
				"ブロックチェーン技術を活用した次世代決済システムの開発。クロスボーダー送金、暗号資産取引、スマートコントラクトを活用した自動決済機能を実装。",
			role: "開発者",
			period: "2021年7月 - 2021年12月（6ヶ月）",
			team_size: "1名（個人開発）",
			technologies: [
				"React Native",
				"Node.js",
				"Solidity",
				"Ethereum",
				"Web3.js",
				"AWS",
			],
			challenges: [
				"ブロックチェーンの複雑な仕様理解",
				"セキュリティリスクへの対応",
				"クロスプラットフォーム対応",
			],
			solutions: [
				"包括的なセキュリティテストの実施",
				"モバイルウォレットSDKの活用",
				"クロスプラットフォームフレームワークの採用",
			],
			results: [
				"App Store評価4.5以上を達成",
				"月間アクティブユーザー1000人を突破",
				"取引手数料を従来比70%削減",
			],
		},
	},
];
