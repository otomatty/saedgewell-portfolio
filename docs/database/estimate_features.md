# estimate_features

見積もりの機能を管理するテーブル

## テーブル定義

```sql
CREATE TABLE estimate_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration DECIMAL NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('core', 'user', 'auth', 'content', 'payment', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 機能の一意識別子 |
| estimate_id | UUID | NO | - | 見積もりの外部キー |
| name | TEXT | NO | - | 機能名 |
| description | TEXT | NO | - | 機能の説明 |
| price | INTEGER | NO | - | 機能の価格 |
| duration | DECIMAL | NO | - | 開発期間（日） |
| is_required | BOOLEAN | NO | false | 必須機能かどうか |
| category | TEXT | NO | - | 機能のカテゴリー |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |

## インデックス

```sql
-- 見積もりIDによる検索を高速化
CREATE INDEX estimate_features_estimate_id_idx ON estimate_features (estimate_id);

-- カテゴリーによる検索を高速化
CREATE INDEX estimate_features_category_idx ON estimate_features (category);

-- 必須機能の検索を高速化
CREATE INDEX estimate_features_is_required_idx ON estimate_features (is_required);
```

## RLSポリシー

```sql
ALTER TABLE estimate_features ENABLE ROW LEVEL SECURITY;

-- 管理者のみ機能の作成・編集・削除が可能
CREATE POLICY "管理者のみ機能の作成・編集・削除が可能" ON estimate_features
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 見積もりに紐づく機能は誰でも閲覧可能
CREATE POLICY "見積もりに紐づく機能は誰でも閲覧可能" ON estimate_features
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM estimates
      WHERE estimates.id = estimate_id
    )
  );
```

## トリガー

```sql
-- 見積もりの合計金額を更新
CREATE TRIGGER update_estimate_total_cost
  AFTER INSERT OR UPDATE OR DELETE ON estimate_features
  FOR EACH ROW
  EXECUTE FUNCTION update_estimate_total_cost();
```

## トリガー関数

```sql
-- 見積もり合計金額更新用の関数
CREATE OR REPLACE FUNCTION update_estimate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE estimates
    SET base_cost = (
      SELECT COALESCE(SUM(price), 0)
      FROM estimate_features
      WHERE estimate_id = OLD.estimate_id
    )
    WHERE id = OLD.estimate_id;
  ELSE
    UPDATE estimates
    SET base_cost = (
      SELECT COALESCE(SUM(price), 0)
      FROM estimate_features
      WHERE estimate_id = NEW.estimate_id
    )
    WHERE id = NEW.estimate_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## 関連テーブル

- [estimates](./estimates.md) 