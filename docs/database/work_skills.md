# work_skills

実績とスキルの関連付けを管理するテーブル

## テーブル定義

```sql
CREATE TABLE work_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(work_id, skill_id)
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 関連付けの一意識別子 |
| work_id | UUID | NO | - | 関連する実績のID |
| skill_id | UUID | NO | - | 関連するスキルのID |
| description | TEXT | NO | - | この実績でのスキルの活用方法の説明 |
| highlights | TEXT[] | YES | - | 特筆すべき成果や工夫の配列 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- 実績IDによる検索を高速化
CREATE INDEX work_skills_work_id_idx ON work_skills (work_id);

-- スキルIDによる検索を高速化
CREATE INDEX work_skills_skill_id_idx ON work_skills (skill_id);
```

## RLSポリシー

```sql
ALTER TABLE work_skills ENABLE ROW LEVEL SECURITY;

-- 実績とスキルの公開状態に連動して閲覧可能
CREATE POLICY "実績とスキルの公開状態に連動" ON work_skills
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM works, skills
    WHERE works.id = work_skills.work_id
    AND skills.id = work_skills.skill_id
    AND works.status = 'published'
    AND skills.status = 'published'
  ));

-- 管理者のみ作成・編集・削除が可能
CREATE POLICY "管理者のみ作成・編集・削除が可能" ON work_skills
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_work_skills_updated_at
  BEFORE UPDATE ON work_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 関連テーブル

- [works](./works.md)
- [skills](./skills.md) 