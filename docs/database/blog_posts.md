# blog_posts

ブログ記事を管理するテーブル

## テーブル定義

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estimated_reading_time INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 記事の一意識別子 |
| slug | TEXT | NO | - | URLで使用する一意のスラッグ |
| title | TEXT | NO | - | 記事のタイトル |
| description | TEXT | NO | - | 記事の説明文 |
| content | TEXT | NO | - | 記事の本文（MDX形式） |
| thumbnail_url | TEXT | YES | - | サムネイル画像のURL |
| published_at | TIMESTAMP WITH TIME ZONE | YES | - | 公開日時 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |
| estimated_reading_time | INTEGER | NO | - | 推定読了時間（分） |
| status | TEXT | NO | 'draft' | 記事のステータス |

## インデックス

```sql
-- スラッグによる検索を高速化
CREATE INDEX blog_posts_slug_idx ON blog_posts (slug);

-- 公開日時による検索・ソートを高速化
CREATE INDEX blog_posts_published_at_idx ON blog_posts (published_at);

-- ステータスと公開日時の複合インデックス
CREATE INDEX blog_posts_status_published_at_idx ON blog_posts (status, published_at);
```

## RLSポリシー

```sql
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 公開済みの記事は誰でも閲覧可能
CREATE POLICY "公開済みの記事は誰でも閲覧可能" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- 管理者のみ記事の作成・編集・削除が可能
CREATE POLICY "管理者のみ記事の作成・編集・削除が可能" ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 公開時に公開日時を設定
CREATE TRIGGER set_published_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at_on_publish();
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

-- 公開日時設定用の関数
CREATE OR REPLACE FUNCTION set_published_at_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 関連テーブル

- [blog_categories](./blog_categories.md)
- [blog_posts_categories](./blog_posts_categories.md) 