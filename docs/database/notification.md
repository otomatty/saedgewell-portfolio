# 通知システム データベース設計

## テーブル一覧

1. `notifications` - 通知データを管理
2. `notification_settings` - ユーザーごとの通知設定を管理

## SQL クエリ

以下のクエリをSQLエディターで実行してください。

```sql
-- 通知テーブルの作成
create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  type text not null check (type in ('project_update', 'chat_message', 'milestone', 'document', 'system')),
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 通知設定テーブルの作成
create table notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_updates boolean default true,
  chat_messages boolean default true,
  milestones boolean default true,
  documents boolean default true,
  system_notifications boolean default true,
  email_notifications boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- RLSの設定
alter table notifications enable row level security;
alter table notification_settings enable row level security;

-- 通知テーブルのポリシー
create policy "ユーザーは自分の通知のみ参照可能"
  on notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "システムは通知を作成可能"
  on notifications for insert
  to service_role
  with check (true);

-- 通知設定テーブルのポリシー
create policy "ユーザーは自分の通知設定のみ参照・更新可能"
  on notification_settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "ユーザーは自分の通知設定のみ更新可能"
  on notification_settings for update
  to authenticated
  using (auth.uid() = user_id);

create policy "システムは通知設定を作成可能"
  on notification_settings for insert
  to service_role
  with check (true);

-- インデックスの作成
create index notifications_user_id_idx on notifications(user_id);
create index notifications_created_at_idx on notifications(created_at);
create unique index notification_settings_user_id_idx on notification_settings(user_id);

-- 更新日時の自動更新トリガー
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on notifications
  for each row execute procedure moddatetime (updated_at);

create trigger handle_updated_at before update on notification_settings
  for each row execute procedure moddatetime (updated_at);

-- 古い通知の自動削除
create extension if not exists pg_cron schema extensions;

select cron.schedule('0 0 * * *', $$
  delete from notifications where created_at < now() - interval '30 days';
$$);

-- ユーザー作成時の通知設定自動作成トリガー
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.notification_settings (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## テーブル詳細

### notifications

| カラム名 | 型 | NULL | 説明 |
|----------|------|------|------|
| id | uuid | NO | 主キー |
| user_id | uuid | NO | 通知の受信者ID |
| title | text | NO | 通知のタイトル |
| content | text | NO | 通知の内容 |
| type | text | NO | 通知の種類 |
| link | text | YES | 関連リンク |
| is_read | boolean | NO | 既読フラグ |
| created_at | timestamp with time zone | NO | 作成日時 |
| updated_at | timestamp with time zone | NO | 更新日時 |

#### 通知の種類（type）

- `project_update`: プロジェクトの更新通知
- `chat_message`: チャットメッセージの通知
- `milestone`: マイルストーンの通知
- `document`: ドキュメントの通知
- `system`: システム通知

### notification_settings

| カラム名 | 型 | NULL | 説明 |
|----------|------|------|------|
| id | uuid | NO | 主キー |
| user_id | uuid | NO | ユーザーID |
| project_updates | boolean | NO | プロジェクト更新通知の有効/無効 |
| chat_messages | boolean | NO | チャットメッセージ通知の有効/無効 |
| milestones | boolean | NO | マイルストーン通知の有効/無効 |
| documents | boolean | NO | ドキュメント通知の有効/無効 |
| system_notifications | boolean | NO | システム通知の有効/無効 |
| email_notifications | boolean | NO | メール通知の有効/無効 |
| created_at | timestamp with time zone | NO | 作成日時 |
| updated_at | timestamp with time zone | NO | 更新日時 |

## セキュリティ設定

- RLSを有効化し、ユーザーは自分の通知と設定のみアクセス可能
- システム（service_role）のみが通知と設定を作成可能

## インデックス

- `notifications_user_id_idx`: ユーザーごとの通知検索を高速化
- `notifications_created_at_idx`: 古い通知の削除処理を高速化
- `notification_settings_user_id_idx`: ユーザーIDにユニークインデックス

## トリガー

1. 更新日時の自動更新
   - `handle_updated_at`: レコード更新時に更新日時を自動更新

2. 古い通知の自動削除
   - 30日以上経過した通知を毎日自動削除（pg_cronを使用）

3. 通知設定の自動作成
   - `on_auth_user_created`: 新規ユーザー作成時に通知設定を自動作成

## 拡張機能

- `moddatetime`: 更新日時の自動更新用
- `pg_cron`: 定期的なタスク実行用 