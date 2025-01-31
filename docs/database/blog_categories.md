# blog_categories

ブログ記事のカテゴリーを管理するテーブル

## テーブル定義

```sql
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | カテゴリーの一意識別子 |
| name | TEXT | NO | - | カテゴリー名 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |

## インデックス

```sql
-- カテゴリー名による検索を高速化
CREATE INDEX blog_categories_name_idx ON blog_categories (name);
```

## RLSポリシー

```sql
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- カテゴリーは誰でも閲覧可能
CREATE POLICY "カテゴリーは誰でも閲覧可能" ON blog_categories
  FOR SELECT
  TO PUBLIC;

-- 管理者のみカテゴリーの作成・編集・削除が可能
CREATE POLICY "管理者のみカテゴリーの作成・編集・削除が可能" ON blog_categories
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## 関連テーブル

- [blog_posts](./blog_posts.md)
- [blog_posts_categories](./blog_posts_categories.md) 