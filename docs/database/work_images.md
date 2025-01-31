# work_images

実績の画像を管理するテーブル

## テーブル定義

```sql
CREATE TABLE work_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 画像の一意識別子 |
| work_id | UUID | NO | - | 実績の外部キー |
| url | TEXT | NO | - | 画像のURL |
| alt | TEXT | NO | - | 代替テキスト |
| caption | TEXT | YES | - | キャプション |
| sort_order | INTEGER | NO | 0 | 表示順序 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- 実績IDと表示順序による検索を高速化
CREATE INDEX work_images_work_id_sort_order_idx ON work_images (work_id, sort_order);
```

## RLSポリシー

```sql
ALTER TABLE work_images ENABLE ROW LEVEL SECURITY;

-- 公開済みの実績の画像は誰でも閲覧可能
CREATE POLICY "公開済みの実績の画像は誰でも閲覧可能" ON work_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 管理者のみ画像の作成・編集・削除が可能
CREATE POLICY "管理者のみ画像の作成・編集・削除が可能" ON work_images
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_work_images_updated_at
  BEFORE UPDATE ON work_images
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

- [works](./works.md) 