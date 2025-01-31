# work_details

実績の詳細情報を管理するテーブル

## テーブル定義

```sql
CREATE TABLE work_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  overview TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  team_size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 詳細情報の一意識別子 |
| work_id | UUID | NO | - | 実績の外部キー |
| overview | TEXT | NO | - | プロジェクト概要 |
| role | TEXT | NO | - | 担当役割 |
| period | TEXT | NO | - | プロジェクト期間 |
| team_size | TEXT | NO | - | チーム規模 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- 実績IDによる検索を高速化
CREATE INDEX work_details_work_id_idx ON work_details (work_id);
```

## RLSポリシー

```sql
ALTER TABLE work_details ENABLE ROW LEVEL SECURITY;

-- 公開済みの実績の詳細は誰でも閲覧可能
CREATE POLICY "公開済みの実績の詳細は誰でも閲覧可能" ON work_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 管理者のみ詳細情報の作成・編集・削除が可能
CREATE POLICY "管理者のみ詳細情報の作成・編集・削除が可能" ON work_details
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_work_details_updated_at
  BEFORE UPDATE ON work_details
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
- [work_responsibilities](./work_responsibilities.md)
- [work_challenges](./work_challenges.md)
- [work_solutions](./work_solutions.md)
- [work_results](./work_results.md) 