# ロールテーブル (roles)

## 概要
システム内で使用する役割（ロール）を管理するテーブルです。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| name | text | NO | - | ロール名（一意制約あり） |
| description | text | YES | NULL | ロールの説明 |
| created_at | timestamptz | NO | now() | 作成日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (name)

## 初期データ

```sql
insert into public.roles (name, description) values
  ('admin', '管理者権限'),
  ('client', 'クライアント権限'),
  ('user', '一般ユーザー権限');
```

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "ロールは認証済みユーザーが閲覧可能"
on public.roles for select
to authenticated
using (true);
```