# notifications テーブル

プロジェクトの通知を管理するテーブル

## テーブル定義

```sql
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

-- RLSの設定
alter table notifications enable row level security;

-- ポリシーの作成
create policy "ユーザーは自分の通知のみ参照可能"
  on notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "システムは通知を作成可能"
  on notifications for insert
  to service_role
  with check (true);

-- インデックスの作成
create index notifications_user_id_idx on notifications(user_id);
create index notifications_created_at_idx on notifications(created_at);

-- 更新日時の自動更新
create trigger handle_updated_at before update on notifications
  for each row execute procedure moddatetime (updated_at);

-- 通知が30日以上経過したら自動削除
create extension if not exists pg_cron;
select cron.schedule('0 0 * * *', $$
  delete from notifications where created_at < now() - interval '30 days';
$$);
```

## カラム説明

| カラム名 | 型 | NULL | 説明 |
|----------|------|------|------|
| id | uuid | NO | 主キー |
| user_id | uuid | NO | 通知の受信者ID |
| title | text | NO | 通知のタイトル |
| content | text | NO | 通知の内容 |
| type | text | NO | 通知の種類（project_update: プロジェクト更新, chat_message: チャットメッセージ, milestone: マイルストーン, document: ドキュメント, system: システム） |
| link | text | YES | 通知に関連するリンク |
| is_read | boolean | NO | 既読フラグ |
| created_at | timestamp with time zone | NO | 作成日時 |
| updated_at | timestamp with time zone | NO | 更新日時 |

## セキュリティ

- RLSを有効化し、ユーザーは自分の通知のみ参照可能
- システム（service_role）のみが通知を作成可能

## インデックス

- user_id: ユーザーごとの通知検索を高速化
- created_at: 古い通知の削除処理を高速化

## トリガー

- updated_at: レコード更新時に更新日時を自動更新
- 30日以上経過した通知は自動削除（pg_cronを使用） 