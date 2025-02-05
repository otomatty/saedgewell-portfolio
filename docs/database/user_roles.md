# ユーザーロール関連テーブル (user_roles)

## 概要
ユーザーとロールの関連を管理する中間テーブルです。
ユーザーは複数のロールを持つことができ、ロールは複数のユーザーに割り当てることができます。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| user_id | uuid | NO | - | プロフィールテーブルの外部キー |
| role_id | uuid | NO | - | ロールテーブルの外部キー |
| created_at | timestamptz | NO | now() | 作成日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (user_id, role_id)
- INDEX (user_id)
- INDEX (role_id)

## 外部キー制約

- user_id → public.profiles(id) ON DELETE CASCADE
- role_id → public.roles(id) ON DELETE CASCADE

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "ユーザーロールは認証済みユーザーが閲覧可能"
on public.user_roles for select
to authenticated
using (true);
```

### 管理ポリシー（ALL）
```sql
create policy "ユーザーロールは管理者のみが管理可能"
on public.user_roles for all
using (
  exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name = 'admin'
  )
); 