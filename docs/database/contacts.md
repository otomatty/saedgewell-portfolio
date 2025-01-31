# contacts

お問い合わせを管理するテーブル

## テーブル定義

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('company', 'general', 'estimate')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | UUID | NO | gen_random_uuid() | お問い合わせの一意識別子 |
| type | TEXT | NO | - | お問い合わせの種類（company: 企業向け, general: 一般向け, estimate: 見積もり依頼） |
| name | TEXT | NO | - | 問い合わせ者名 |
| email | TEXT | NO | - | メールアドレス |
| company_name | TEXT | YES | - | 会社名 |
| phone | TEXT | YES | - | 電話番号 |
| message | TEXT | NO | - | お問い合わせ内容 |
| status | TEXT | NO | 'new' | 対応状況 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | now() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | now() | 更新日時 |

## インデックス

```sql
-- メールアドレスによる検索を高速化
CREATE INDEX contacts_email_idx ON contacts (email);

-- タイプと状態による検索を高速化
CREATE INDEX contacts_type_status_idx ON contacts (type, status);

-- 作成日時による検索・ソートを高速化
CREATE INDEX contacts_created_at_idx ON contacts (created_at);
```

## RLSポリシー

```sql
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 誰でもお問い合わせを作成可能
CREATE POLICY "誰でもお問い合わせを作成可能" ON contacts
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- 管理者のみお問い合わせの閲覧・編集・削除が可能
CREATE POLICY "管理者のみお問い合わせの閲覧・編集・削除が可能" ON contacts
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## トリガー

```sql
-- 更新日時を自動更新
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
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