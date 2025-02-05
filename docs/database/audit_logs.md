# 監査ログテーブル (audit_logs)

## 概要
システム内で発生する重要な操作やイベントを記録するテーブルです。
セキュリティ監査やコンプライアンス対応のために使用します。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| user_id | uuid | NO | - | 操作を実行したユーザーのID |
| action | text | NO | - | 実行された操作（例: 'login', 'logout', 'create', 'update', 'delete'） |
| entity_type | text | NO | - | 操作対象のエンティティ種別（例: 'user', 'role', 'permission'） |
| entity_id | uuid | YES | NULL | 操作対象のエンティティID |
| old_values | jsonb | YES | NULL | 変更前の値（更新/削除時） |
| new_values | jsonb | YES | NULL | 変更後の値（作成/更新時） |
| ip_address | inet | YES | NULL | クライアントIPアドレス |
| user_agent | text | YES | NULL | ユーザーエージェント |
| status | text | NO | 'success' | 操作の結果（'success' or 'failure'） |
| error_message | text | YES | NULL | エラーメッセージ（失敗時） |
| created_at | timestamptz | NO | now() | 記録日時 |

## インデックス

- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (action)
- INDEX (entity_type, entity_id)
- INDEX (created_at)
- INDEX (status)

## 外部キー制約

- user_id → public.profiles(id) ON DELETE SET NULL

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "監査ログは管理者のみが閲覧可能"
on public.audit_logs for select
using (
  exists (
    select 1 from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = auth.uid()
    and r.name = 'admin'
  )
);
```

### 挿入ポリシー（INSERT）
```sql
create policy "監査ログは認証済みユーザーが作成可能"
on public.audit_logs for insert
to authenticated
with check (true);
```

## トリガー関数

```sql
-- 監査ログを記録するトリガー関数
create or replace function public.create_audit_log()
returns trigger as $$
declare
  v_old_values jsonb;
  v_new_values jsonb;
begin
  if (tg_op = 'UPDATE') then
    v_old_values = to_jsonb(old);
    v_new_values = to_jsonb(new);
  elsif (tg_op = 'DELETE') then
    v_old_values = to_jsonb(old);
  elsif (tg_op = 'INSERT') then
    v_new_values = to_jsonb(new);
  end if;

  insert into public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    coalesce(new.id, old.id),
    v_old_values,
    v_new_values,
    inet_client_addr(),
    current_setting('request.headers')::json->>'user-agent'
  );

  return coalesce(new, old);
end;
$$ language plpgsql security definer;
```

## 使用例

1. テーブルへのトリガー設定
```sql
-- プロフィールテーブルの監査
create trigger audit_profiles
after insert or update or delete on public.profiles
for each row execute function public.create_audit_log();

-- ロールテーブルの監査
create trigger audit_roles
after insert or update or delete on public.roles
for each row execute function public.create_audit_log();
```

2. 手動での監査ログ記録
```sql
-- ログイン成功時の記録
insert into public.audit_logs (
  user_id,
  action,
  entity_type,
  status
) values (
  auth.uid(),
  'login',
  'session',
  'success'
);
``` 