# works

実績の基本情報を管理するテーブル

## テーブル定義

```sql
CREATE TABLE works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('company', 'freelance', 'personal')),
  github_url TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 実績の一意識別子 |
| slug | TEXT | NO | - | URLで使用する一意のスラッグ |
| title | TEXT | NO | - | 実績のタイトル |
| description | TEXT | NO | - | 実績の説明文 |
| thumbnail_url | TEXT | NO | - | サムネイル画像のURL |
| category | TEXT | NO | - | カテゴリー（company: 企業案件, freelance: フリーランス案件, personal: 個人開発） |
| github_url | TEXT | YES | - | GitHubリポジトリのURL |
| website_url | TEXT | YES | - | 公開サイトのURL |
| status | TEXT | NO | 'draft' | 公開状態 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- スラッグによる検索を高速化
CREATE INDEX works_slug_idx ON works (slug);

-- カテゴリーによる検索を高速化
CREATE INDEX works_category_idx ON works (category);

-- ステータスと作成日時の複合インデックス
CREATE INDEX works_status_created_at_idx ON works (status, created_at);
```

## RLSポリシー

```sql
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 公開済みの実績は誰でも閲覧可能
CREATE POLICY "公開済みの実績は誰でも閲覧可能" ON works
  FOR SELECT
  USING (status = 'published');

-- 管理者のみ実績の作成・編集・削除が可能
CREATE POLICY "管理者のみ実績の作成・編集・削除が可能" ON works
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_works_updated_at
  BEFORE UPDATE ON works
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## トリガー関数

```sql
-- 更新日時更新用の関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 関連テーブル

- [work_details](./work_details.md)
- [work_images](./work_images.md)
- [work_technologies](./work_technologies.md) 