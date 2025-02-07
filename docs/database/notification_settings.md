# notification_settings テーブル

ユーザーごとの通知設定を管理するテーブル

## テーブル定義

```sql
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
alter table notification_settings enable row level security;

-- ポリシーの作成
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
create unique index notification_settings_user_id_idx on notification_settings(user_id);

-- 更新日時の自動更新
create trigger handle_updated_at before update on notification_settings
  for each row execute procedure moddatetime (updated_at);

-- ユーザー作成時に通知設定を自動作成
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

## カラム説明

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

## セキュリティ

- RLSを有効化し、ユーザーは自分の通知設定のみ参照・更新可能
- システム（service_role）のみが通知設定を作成可能

## インデックス

- user_id: ユーザーIDにユニークインデックスを作成

## トリガー

- updated_at: レコード更新時に更新日時を自動更新
- on_auth_user_created: 新規ユーザー作成時に通知設定を自動作成 