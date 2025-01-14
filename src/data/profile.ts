import type { Profile } from "@/types";

export const PROFILE: Profile = {
	name: "John Doe",
	photoUrl: "/images/profile/avatar.jpg",
	introduction:
		"フルスタック開発者として、Webアプリケーションの設計から実装、運用まで一貫して担当してきました。特にフロントエンド開発に強みを持ち、パフォーマンスとユーザー体験を重視した開発を心がけています。",
	contacts: {
		email: "john.doe@example.com",
		github: "https://github.com/johndoe",
		linkedin: "https://linkedin.com/in/johndoe",
	},
	careerHistory: [
		{
			companyName: "テックスタートアップ株式会社",
			period: {
				start: new Date("2022-04"),
				end: new Date(),
			},
			position: "シニアフロントエンドエンジニア",
			description:
				"新規Webアプリケーションの設計・開発をリード。Next.js、TypeScript、TailwindCSSを用いたモダンな開発環境を構築し、チームの生産性を向上させました。",
		},
		{
			companyName: "ITコンサルティング株式会社",
			period: {
				start: new Date("2020-04"),
				end: new Date("2022-03"),
			},
			position: "フルスタックエンジニア",
			description:
				"複数のクライアントプロジェクトに参画し、要件定義から実装、運用まで担当。特にパフォーマンス改善とコード品質の向上に注力しました。",
		},
	],
	education: [
		{
			school: "○○大学",
			degree: "情報工学部 情報工学科",
			period: {
				start: new Date("2016-04"),
				end: new Date("2020-03"),
			},
		},
	],
	qualifications: [
		{
			name: "応用情報技術者",
			acquiredDate: new Date("2019-12"),
		},
		{
			name: "AWS認定ソリューションアーキテクト – アソシエイト",
			acquiredDate: new Date("2021-06"),
		},
	],
};
