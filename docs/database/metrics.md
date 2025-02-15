# メトリクス（統計情報）テーブル設計

## 概要

ポートフォリオサイトで表示する各種統計情報（開発経験年数、プロジェクト数など）を管理するためのテーブル設計について記述します。

## テーブル設計方針

### 1. ENUMを使用した統計情報の種類の固定化

統計情報の種類を`metric_type`というENUM型で定義し、値を固定化します。これにより、型安全性を確保し、管理を容易にします。

### 2. テーブル構造

`metrics`テーブルを作成し、以下のような構造とします：

```sql
-- 統計情報の種類を定義するENUM
CREATE TYPE metric_type AS ENUM (
  'development_experience',  -- 開発経験
  'project_count',          -- プロジェクト数
  'article_count',          -- 技術記事数
  'personal_project_count'  -- 個人開発数
);

-- メトリクステーブル
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type metric_type NOT NULL UNIQUE,  -- 統計情報の種類（ENUM）
  value INTEGER NOT NULL,            -- 値
  unit TEXT NOT NULL,               -- 単位（年、件、個など）
  display_name TEXT NOT NULL,       -- 表示名
  description TEXT,                 -- 説明（オプション）
  icon TEXT NOT NULL,              -- アイコン名
  href TEXT NOT NULL,              -- リンク先
  cta TEXT NOT NULL,               -- Call to Action
  sort_order INTEGER NOT NULL,      -- 表示順
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 3. RLSポリシー

以下のようなRLSポリシーを設定し、セキュリティを確保します：

```sql
-- RLSを有効化
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（全ユーザーに許可）
CREATE POLICY "Allow read access for all users" ON metrics
  FOR SELECT
  TO public
  USING (true);

-- 挿入ポリシー（認証済み管理者のみ）
CREATE POLICY "Allow insert for authenticated admin users" ON metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  ));

-- 更新ポリシー（認証済み管理者のみ）
CREATE POLICY "Allow update for authenticated admin users" ON metrics
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  ));

-- 削除ポリシー（認証済み管理者のみ）
CREATE POLICY "Allow delete for authenticated admin users" ON metrics
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  ));
```

### 4. 初期データ

以下のような初期データを投入します：

```sql
INSERT INTO metrics 
  (type, value, unit, display_name, description, icon, href, cta, sort_order)
VALUES
  (
    'development_experience',
    5,
    '年',
    '開発経験',
    '実務での開発経験年数',
    'CodeIcon',
    '/experience',
    '経験を見る',
    1
  ),
  (
    'project_count',
    50,
    '件',
    'プロジェクト',
    '参画したプロジェクト数',
    'TextIcon',
    '/projects',
    '実績を見る',
    2
  ),
  (
    'article_count',
    30,
    '記事',
    '技術記事',
    '執筆した技術記事数',
    'FileTextIcon',
    '/articles',
    '記事を読む',
    3
  ),
  (
    'personal_project_count',
    10,
    '個',
    '個人開発',
    '個人開発プロジェクト数',
    'CodeIcon',
    '/personal-projects',
    'プロジェクトを見る',
    4
  );
```

## TypeScript型定義

`src/types/metrics.ts`に以下のような型定義を作成します：

```typescript
export type MetricType =
  | 'development_experience'
  | 'project_count'
  | 'article_count'
  | 'personal_project_count';

export interface Metric {
  id: string;
  type: MetricType;
  value: number;
  unit: string;
  display_name: string;
  description?: string;
  icon: string;
  href: string;
  cta: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

## データ取得方法

Server Actionsを使用してデータを取得します：

```typescript
// src/app/actions/metrics.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metric } from '@/types/metrics';

export async function getMetrics() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: metrics, error } = await supabase
    .from('metrics')
    .select('*')
    .order('sort_order');
    
  if (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
  
  return metrics as Metric[];
}
```

## 実装のメリット

1. **型安全性**
   - ENUMによる統計情報の種類の固定化
   - TypeScriptとの型の整合性確保

2. **管理のしやすさ**
   - 固定された統計情報の種類
   - 表示順の制御が可能

3. **拡張性**
   - 必要に応じた新しい統計情報の追加
   - オプションフィールドの用意

4. **セキュリティ**
   - RLSによるアクセス制御
   - 管理者のみによる更新

5. **パフォーマンス**
   - UNIQUEインデックスによる高速な検索
   - 必要最小限のカラム構成

## 今後の検討事項

1. 統計情報の種類の追加の必要性
2. より詳細な説明や補足情報の追加
3. 管理者ユーザーの定義方法の具体化

## 参考資料

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL ENUM Documentation](https://www.postgresql.org/docs/current/datatype-enum.html)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) 