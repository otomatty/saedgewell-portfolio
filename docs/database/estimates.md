# estimates

見積もり依頼を管理するテーブル

## テーブル定義

```sql
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  project_type TEXT NOT NULL CHECK (project_type IN ('web', 'app', 'other')),
  description TEXT NOT NULL,
  deadline TEXT NOT NULL CHECK (deadline IN ('asap', '1month', '3months', '6months', 'flexible')),
  base_cost INTEGER NOT NULL,
  rush_fee INTEGER NOT NULL DEFAULT 0,
  total_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 見積もりの一意識別子 |
| contact_id | UUID | YES | - | お問い合わせの外部キー |
| project_type | TEXT | NO | - | プロジェクトの種類 |
| description | TEXT | NO | - | プロジェクトの説明 |
| deadline | TEXT | NO | - | 希望納期 |
| base_cost | INTEGER | NO | - | 基本料金 |
| rush_fee | INTEGER | NO | 0 | 特急料金 |
| total_cost | INTEGER | NO | - | 合計金額 |
| status | TEXT | NO | 'draft' | 見積もりの状態 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- お問い合わせIDによる検索を高速化
CREATE INDEX estimates_contact_id_idx ON estimates (contact_id);

-- プロジェクトタイプと状態による検索を高速化
CREATE INDEX estimates_project_type_status_idx ON estimates (project_type, status);

-- 作成日時による検索・ソートを高速化
CREATE INDEX estimates_created_at_idx ON estimates (created_at);
```

## RLSポリシー

```sql
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- 誰でも見積もりを作成可能
CREATE POLICY "誰でも見積もりを作成可能" ON estimates
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- 管理者のみ見積もりの閲覧・編集・削除が可能
CREATE POLICY "管理者のみ見積もりの閲覧・編集・削除が可能" ON estimates
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 合計金額を自動計算
CREATE TRIGGER calculate_total_cost
  BEFORE INSERT OR UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_cost();
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

-- 合計金額計算用の関数
CREATE OR REPLACE FUNCTION calculate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost = NEW.base_cost + NEW.rush_fee;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 関連テーブル

- [contacts](./contacts.md)
- [estimate_features](./estimate_features.md)
- [estimate_requirements](./estimate_requirements.md) 