import ServicesList from "./_components/ServicesList";
import WorkingProcess from "./_components/WorkingProcess";
import Testimonials from "./_components/Testimonials";
import ContactCTA from "./_components/ContactCTA";
import FAQ from "./_components/FAQ";
import PricingPlans from "./_components/PricingPlans";
import HeroSection from "./_components/HeroSection";

const SERVICES = [
	{
		iconName: "Code",
		title: "フロントエンド開発",
		description:
			"モダンなWebアプリケーションの開発、既存サイトのリニューアル、パフォーマンス改善など",
		details: [
			"Next.js / React による開発",
			"TypeScript によるコーディング",
			"レスポンシブデザインの実装",
			"アクセシビリティ対応",
		],
	},
	{
		iconName: "Layout",
		title: "UI/UX改善",
		description:
			"ユーザビリティの向上、デザインシステムの構築、インタラクションの改善など",
		details: [
			"ユーザビリティテスト",
			"デザインシステムの実装",
			"アニメーション・インタラクション",
			"プロトタイプ作成",
		],
	},
	{
		iconName: "Rocket",
		title: "パフォーマンス最適化",
		description:
			"Webサイトの表示速度改善、SEO対策、Core Web Vitalsの最適化など",
		details: [
			"パフォーマンス分析",
			"画像・アセットの最適化",
			"キャッシュ戦略の実装",
			"Core Web Vitalsの改善",
		],
	},
	{
		iconName: "Wrench",
		title: "技術支援・コンサルティング",
		description: "技術選定、アーキテクチャ設計、コードレビュー、チーム支援など",
		details: [
			"技術スタックの選定",
			"アーキテクチャ設計",
			"コードレビュー",
			"チーム開発支援",
		],
	},
	{
		iconName: "Lightbulb",
		title: "プロトタイプ開発",
		description: "新規プロダクトのPoC開発、MVPの構築、機能検証など",
		details: [
			"プロトタイプ開発",
			"PoC/MVP構築",
			"技術検証",
			"フィードバック収集",
		],
	},
	{
		iconName: "LineChart",
		title: "保守・運用",
		description:
			"継続的な改善、バグ修正、セキュリティ対応、パフォーマンスモニタリングなど",
		details: [
			"継続的な改善",
			"バグ修正・保守",
			"セキュリティ対応",
			"パフォーマンス監視",
		],
	},
];

const PROCESS_STEPS = [
	{
		iconName: "MessageSquare",
		title: "要件のヒアリング",
		description:
			"プロジェクトの目的、要件、予算、スケジュールなどについて詳しくお伺いします。",
	},
	{
		iconName: "Timer",
		title: "見積もり・提案",
		description:
			"ヒアリング内容を基に、最適な解決策と見積もりを提案させていただきます。",
	},
	{
		iconName: "Briefcase",
		title: "契約・着手",
		description:
			"契約締結後、プロジェクトを開始。定期的な進捗報告と調整を行います。",
	},
];

export default function WorkWithMePage() {
	return (
		<div className="min-h-screen">
			<HeroSection />

			<div id="services">
				<ServicesList services={SERVICES} />
			</div>

			{/* 料金プラン */}
			<div id="pricing">
				<PricingPlans />
			</div>

			{/* 仕事の進め方 */}
			<div id="consulting">
				<WorkingProcess steps={PROCESS_STEPS} />
			</div>

			{/* 実績・評価 */}
			<Testimonials />

			{/* FAQ */}
			<div id="faq">
				<FAQ />
			</div>

			{/* お問い合わせCTA */}
			<div id="contact">
				<ContactCTA />
			</div>
		</div>
	);
}
