# ロール権限関連テーブル (role_permissions)

## 概要
ロールと権限の関連を管理する中間テーブルです。
ロールは複数の権限を持つことができ、権限は複数のロールに割り当てることができます。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| role_id | uuid | NO | - | ロールテーブルの外部キー |
| permission_id | uuid | NO | - | 権限テーブルの外部キー |
| created_at | timestamptz | NO | now() | 作成日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (role_id, permission_id)
- INDEX (role_id)
- INDEX (permission_id)

## 外部キー制約

- role_id → public.roles(id) ON DELETE CASCADE
- permission_id → public.permissions(id) ON DELETE CASCADE

## 初期データ

```sql
-- 管理者に全ての権限を付与
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin';

-- クライアントに特定の権限を付与
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'client'
and p.name in ('view_client_dashboard', 'manage_client_projects');
```

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "ロール権限は認証済みユーザーが閲覧可能"
on public.role_permissions for select
to authenticated
using (true);
```

### 管理ポリシー（ALL）
```sql
create policy "ロール権限は管理者のみが管理可能"
on public.role_permissions for all
using (
  exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name = 'admin'
  )
); 