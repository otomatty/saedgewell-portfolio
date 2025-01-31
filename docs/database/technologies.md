# technologies

技術スタックを管理するテーブル

## テーブル定義

```sql
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'infrastructure', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 技術の一意識別子 |
| name | TEXT | NO | - | 技術名 |
| category | TEXT | NO | - | カテゴリー（frontend: フロントエンド, backend: バックエンド, database: データベース, infrastructure: インフラ, other: その他） |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- 技術名による検索を高速化
CREATE INDEX technologies_name_idx ON technologies (name);

-- カテゴリーによる検索を高速化
CREATE INDEX technologies_category_idx ON technologies (category);
```

## RLSポリシー

```sql
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- 技術スタックは誰でも閲覧可能
CREATE POLICY "技術スタックは誰でも閲覧可能" ON technologies
  FOR SELECT
  TO PUBLIC;

-- 管理者のみ技術スタックの作成・編集・削除が可能
CREATE POLICY "管理者のみ技術スタックの作成・編集・削除が可能" ON technologies
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_technologies_updated_at
  BEFORE UPDATE ON technologies
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

- [work_technologies](./work_technologies.md) 