# プロフィールテーブル (profiles)

## 概要
ユーザーの基本情報を管理するテーブルです。auth.usersテーブルと1:1で紐づきます。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | - | プライマリーキー。auth.usersテーブルの外部キー |
| email | text | NO | - | メールアドレス（一意制約あり） |
| full_name | text | YES | NULL | フルネーム |
| avatar_url | text | YES | NULL | アバター画像のURL |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (email)

## 外部キー制約

- id → auth.users(id) ON DELETE CASCADE

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "プロフィールは認証済みユーザーが閲覧可能"
on public.profiles for select
to authenticated
using (true);
```

### 更新ポリシー（UPDATE）
```sql
create policy "プロフィールは本人のみが更新可能"
on public.profiles for update
using (auth.uid() = id);
```

## トリガー

- updated_at列を更新するトリガー
```sql
create trigger handle_updated_at before update
on profiles
for each row
execute procedure moddatetime (updated_at);
``` 

## RPC

- 初回ログイン時に関連するテーブルを作成するRPC
```sql
create or replace function handle_new_user(
  p_user_id uuid,
  p_email text
)
returns void
language plpgsql
security definer
as $$
declare
  v_default_role_id uuid;
begin
  -- デフォルトロールのIDを取得
  select id into v_default_role_id
  from public.roles
  where name = 'user'
  limit 1;

  -- プロファイルを作成
  insert into public.profiles (id, email, created_at, updated_at)
  values (p_user_id, p_email, now(), now())
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

  -- ユーザーロールを作成
  insert into public.user_roles (user_id, role_id, created_at)
  values (p_user_id, v_default_role_id, now())
  on conflict (user_id, role_id) do nothing;
end;    
$$;
```