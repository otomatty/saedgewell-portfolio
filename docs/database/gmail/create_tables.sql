-- Gmail連携機能のデータベーステーブル作成

-- メール本体の情報を管理するテーブル
create table emails (
  id uuid primary key default gen_random_uuid(),
  gmail_message_id text not null,
  thread_id text not null,
  from_email text not null,
  from_name text,
  to_email text[] not null,
  cc_email text[],
  bcc_email text[],
  subject text not null,
  body_text text,
  body_html text,
  received_at timestamp with time zone not null,
  is_read boolean default false,
  is_archived boolean default false,
  is_starred boolean default false,
  has_attachments boolean default false,
  labels text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- メールの添付ファイル情報を管理するテーブル
create table email_attachments (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  file_path text not null,
  created_at timestamp with time zone default now()
);

-- 送信したメールの返信情報を管理するテーブル
create table email_replies (
  id uuid primary key default gen_random_uuid(),
  original_email_id uuid references emails(id) on delete set null,
  gmail_message_id text not null,
  from_email text not null,
  to_email text[] not null,
  cc_email text[],
  bcc_email text[],
  subject text not null,
  body_text text,
  body_html text,
  sent_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Gmail APIの認証情報を管理するテーブル
create table gmail_credentials (
  id uuid primary key default gen_random_uuid(),
  access_token text not null,
  refresh_token text not null,
  token_type text not null,
  expiry_date timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- メール関連の設定を管理するテーブル
create table email_settings (
  id uuid primary key default gen_random_uuid(),
  auto_archive_after_days integer,
  signature text,
  notification_enabled boolean default true,
  last_sync_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index emails_gmail_message_id_idx on emails(gmail_message_id);
create index emails_thread_id_idx on emails(thread_id);
create index emails_received_at_idx on emails(received_at);

create index email_attachments_email_id_idx on email_attachments(email_id);

create index email_replies_original_email_id_idx on email_replies(original_email_id);
create index email_replies_gmail_message_id_idx on email_replies(gmail_message_id);
create index email_replies_sent_at_idx on email_replies(sent_at);

create index gmail_credentials_expiry_date_idx on gmail_credentials(expiry_date);

-- RLSポリシーの設定
alter table emails enable row level security;
alter table email_attachments enable row level security;
alter table email_replies enable row level security;
alter table gmail_credentials enable row level security;
alter table email_settings enable row level security;

-- emailsテーブルのRLSポリシー
create policy "Emails are only visible to authenticated users"
  on emails for select
  using (auth.role() = 'authenticated');

create policy "Emails can only be inserted by authenticated users"
  on emails for insert
  with check (auth.role() = 'authenticated');

create policy "Emails can only be updated by authenticated users"
  on emails for update
  using (auth.role() = 'authenticated');

-- email_attachmentsテーブルのRLSポリシー
create policy "Email attachments are only visible to authenticated users"
  on email_attachments for select
  using (auth.role() = 'authenticated');

create policy "Email attachments can only be inserted by authenticated users"
  on email_attachments for insert
  with check (auth.role() = 'authenticated');

create policy "Email attachments can only be deleted by authenticated users"
  on email_attachments for delete
  using (auth.role() = 'authenticated');

-- email_repliesテーブルのRLSポリシー
create policy "Email replies are only visible to authenticated users"
  on email_replies for select
  using (auth.role() = 'authenticated');

create policy "Email replies can only be inserted by authenticated users"
  on email_replies for insert
  with check (auth.role() = 'authenticated');

create policy "Email replies can only be updated by authenticated users"
  on email_replies for update
  using (auth.role() = 'authenticated');

-- gmail_credentialsテーブルのRLSポリシー
create policy "Gmail credentials are only visible to authenticated users"
  on gmail_credentials for select
  using (auth.role() = 'authenticated');

create policy "Gmail credentials can only be inserted by authenticated users"
  on gmail_credentials for insert
  with check (auth.role() = 'authenticated');

create policy "Gmail credentials can only be updated by authenticated users"
  on gmail_credentials for update
  using (auth.role() = 'authenticated');

create policy "Gmail credentials can only be deleted by authenticated users"
  on gmail_credentials for delete
  using (auth.role() = 'authenticated');

-- email_settingsテーブルのRLSポリシー
create policy "Email settings are only visible to authenticated users"
  on email_settings for select
  using (auth.role() = 'authenticated');

create policy "Email settings can only be inserted by authenticated users"
  on email_settings for insert
  with check (auth.role() = 'authenticated');

create policy "Email settings can only be updated by authenticated users"
  on email_settings for update
  using (auth.role() = 'authenticated');

-- コメント
comment on table emails is 'メールの本体情報を管理するテーブル';
comment on table email_attachments is 'メールの添付ファイル情報を管理するテーブル';
comment on table email_replies is '送信したメールの返信情報を管理するテーブル';
comment on table gmail_credentials is 'Gmail APIの認証情報を管理するテーブル';
comment on table email_settings is 'メール関連の設定を管理するテーブル'; 