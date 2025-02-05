# 権限テーブル (permissions)

## 概要
システム内で使用する権限を管理するテーブルです。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| name | text | NO | - | 権限名（一意制約あり） |
| description | text | YES | NULL | 権限の説明 |
| created_at | timestamptz | NO | now() | 作成日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (name)

## 初期データ

```sql
insert into public.permissions (name, description) values
  ('manage_users', 'ユーザー管理'),
  ('manage_roles', 'ロール管理'),
  ('manage_content', 'コンテンツ管理'),
  ('view_admin_dashboard', '管理画面閲覧'),
  ('manage_client_projects', 'クライアントプロジェクト管理'),
  ('view_client_dashboard', 'クライアントダッシュボード閲覧');
```

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "権限は認証済みユーザーが閲覧可能"
on public.permissions for select
to authenticated
using (true);
```

### 管理ポリシー（ALL）
```sql
create policy "権限は管理者のみが管理可能"
on public.permissions for all
using (
  exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name = 'admin'
  )
); 