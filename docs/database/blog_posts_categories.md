# blog_posts_categories

ブログ記事とカテゴリーの中間テーブル

## テーブル定義

```sql
CREATE TABLE blog_posts_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| post_id | UUID | NO | - | ブログ記事の外部キー |
| category_id | UUID | NO | - | カテゴリーの外部キー |

## インデックス

```sql
-- カテゴリーIDによる検索を高速化
CREATE INDEX blog_posts_categories_category_id_idx ON blog_posts_categories (category_id);

-- 記事IDによる検索を高速化
CREATE INDEX blog_posts_categories_post_id_idx ON blog_posts_categories (post_id);
```

## RLSポリシー

```sql
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;

-- 公開済みの記事に紐づくカテゴリーは誰でも閲覧可能
CREATE POLICY "公開済みの記事に紐づくカテゴリーは誰でも閲覧可能" ON blog_posts_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = post_id
      AND blog_posts.status = 'published'
    )
  );

-- 管理者のみ記事とカテゴリーの紐付けの作成・削除が可能
CREATE POLICY "管理者のみ記事とカテゴリーの紐付けの作成・削除が可能" ON blog_posts_categories
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## 関連テーブル

- [blog_posts](./blog_posts.md)
- [blog_categories](./blog_categories.md) 