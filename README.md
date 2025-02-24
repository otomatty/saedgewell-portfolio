# Saedgewell Portfolio

ポートフォリオサイトのモノレポプロジェクトです。Next.jsとCloudflare Workersを使用して構築されています。

## プロジェクト構成

```bash
saedgewell-portfolio/
├── apps/
│ ├── web/ # Next.jsフロントエンド
│ └── workers/ # Cloudflare Workers (予定)
├── packages/ # 共有パッケージ (予定)
└── README.md
```

## 技術スタック

### 共通
- TypeScript
- Bun
- Biome (Linter & Formatter)

### フロントエンド (apps/web)
- Next.js 15
- Tailwind CSS
- shadcn/ui
- Jotai
- Vercel

### バックエンド (apps/workers)
- Cloudflare Workers
- Hono
- Supabase

## 開発を始める

### 必要な環境

- Bun >= 1.0.0
- Node.js >= 20.0.0

### セットアップ

1. リポジトリのクローン:

```bash
git clone https://github.com/yourusername/saedgewell-portfolio.git
cd saedgewell-portfolio
```

2. 依存パッケージのインストール:

```bash
bun install
```


3. 環境変数の設定:

```bash
cp .env.example .env
```

4. 開発サーバーの起動:

```bash
bun run dev
```

5. ビルド:

```bash
bun run build
```


## 環境変数

### apps/web

| 変数名 | 説明 | 必須 |
|--------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | SupabaseのURL | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabaseの匿名キー | ✅ |
| GITHUB_ACCESS_TOKEN | GitHubアクセストークン | ✅ |

## デプロイメント

### フロントエンド (apps/web)
- Vercelにデプロイ
- mainブランチへのマージで自動デプロイ

### バックエンド (apps/workers)
- Cloudflare Workersにデプロイ予定
- 実装後に詳細を追加

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 作者
- [@otomatty](https://github.com/otomatty)





