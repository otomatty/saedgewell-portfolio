# estimate_requirements

見積もりの実装要件を管理するテーブル

## テーブル定義

```sql
CREATE TABLE estimate_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  has_design BOOLEAN NOT NULL DEFAULT false,
  design_format TEXT CHECK (design_format IN ('figma', 'xd', 'photoshop', 'sketch', 'other')),
  has_brand_guidelines BOOLEAN NOT NULL DEFAULT false,
  has_logo BOOLEAN NOT NULL DEFAULT false,
  has_images BOOLEAN NOT NULL DEFAULT false,
  has_icons BOOLEAN NOT NULL DEFAULT false,
  has_custom_fonts BOOLEAN NOT NULL DEFAULT false,
  has_content BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | 実装要件の一意識別子 |
| estimate_id | UUID | NO | - | 見積もりの外部キー |
| has_design | BOOLEAN | NO | false | デザインデータの提供有無 |
| design_format | TEXT | YES | - | デザインデータの形式 |
| has_brand_guidelines | BOOLEAN | NO | false | ブランドガイドラインの提供有無 |
| has_logo | BOOLEAN | NO | false | ロゴの提供有無 |
| has_images | BOOLEAN | NO | false | 画像素材の提供有無 |
| has_icons | BOOLEAN | NO | false | アイコンの提供有無 |
| has_custom_fonts | BOOLEAN | NO | false | カスタムフォントの使用有無 |
| has_content | BOOLEAN | NO | false | コンテンツの提供有無 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- 見積もりIDによる検索を高速化
CREATE INDEX estimate_requirements_estimate_id_idx ON estimate_requirements (estimate_id);
```

## RLSポリシー

```sql
ALTER TABLE estimate_requirements ENABLE ROW LEVEL SECURITY;

-- 管理者のみ実装要件の作成・編集・削除が可能
CREATE POLICY "管理者のみ実装要件の作成・編集・削除が可能" ON estimate_requirements
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 見積もりに紐づく実装要件は誰でも閲覧可能
CREATE POLICY "見積もりに紐づく実装要件は誰でも閲覧可能" ON estimate_requirements
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
-- 更新日時を自動更新
CREATE TRIGGER update_estimate_requirements_updated_at
  BEFORE UPDATE ON estimate_requirements
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

- [estimates](./estimates.md) 