# work_technologies

実績と技術スタックの中間テーブル

## テーブル定義

```sql
CREATE TABLE work_technologies (
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (work_id, technology_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| work_id | UUID | NO | - | 実績の外部キー |
| technology_id | UUID | NO | - | 技術の外部キー |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |

## インデックス

```sql
-- 技術IDによる検索を高速化
CREATE INDEX work_technologies_technology_id_idx ON work_technologies (technology_id);

-- 実績IDによる検索を高速化
CREATE INDEX work_technologies_work_id_idx ON work_technologies (work_id);
```

## RLSポリシー

```sql
ALTER TABLE work_technologies ENABLE ROW LEVEL SECURITY;

-- 公開済みの実績に紐づく技術は誰でも閲覧可能
CREATE POLICY "公開済みの実績に紐づく技術は誰でも閲覧可能" ON work_technologies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 管理者のみ実績と技術の紐付けの作成・削除が可能
CREATE POLICY "管理者のみ実績と技術の紐付けの作成・削除が可能" ON work_technologies
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## 関連テーブル

- [works](./works.md)
- [technologies](./technologies.md) 