# emails テーブル

## 概要
メールの本体情報を管理するテーブルです。Gmailから取得したメールデータを保存し、アプリケーション内でのメール表示や管理に使用します。

## テーブル定義

```sql
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
  labels text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | false | gen_random_uuid() | プライマリキー |
| gmail_message_id | text | false | - | Gmail APIから取得したメッセージID |
| thread_id | text | false | - | メールスレッドのID |
| from_email | text | false | - | 送信者のメールアドレス |
| from_name | text | true | - | 送信者の表示名 |
| to_email | text[] | false | - | 宛先メールアドレス（複数可） |
| cc_email | text[] | true | - | CCメールアドレス（複数可） |
| bcc_email | text[] | true | - | BCCメールアドレス（複数可） |
| subject | text | false | - | メールの件名 |
| body_text | text | true | - | メール本文（プレーンテキスト） |
| body_html | text | true | - | メール本文（HTML） |
| received_at | timestamp with time zone | false | - | メール受信日時 |
| is_read | boolean | false | false | 既読フラグ |
| is_archived | boolean | false | false | アーカイブフラグ |
| is_starred | boolean | false | false | スター付きフラグ |
| labels | text[] | true | - | Gmailのラベル情報 |
| created_at | timestamp with time zone | false | now() | レコード作成日時 |
| updated_at | timestamp with time zone | false | now() | レコード更新日時 |

## インデックス

```sql
create index emails_gmail_message_id_idx on emails(gmail_message_id);
create index emails_thread_id_idx on emails(thread_id);
create index emails_received_at_idx on emails(received_at);
```

## RLSポリシー

```sql
alter table emails enable row level security;

create policy "Emails are only visible to authenticated users"
  on emails for select
  using (auth.role() = 'authenticated');

create policy "Emails can only be inserted by authenticated users"
  on emails for insert
  with check (auth.role() = 'authenticated');

create policy "Emails can only be updated by authenticated users"
  on emails for update
  using (auth.role() = 'authenticated');
```

## 関連テーブル
- [email_attachments](./email_attachments.md) - 添付ファイル情報
- [email_replies](./email_replies.md) - 返信情報

## 注意事項
- メール本文は必要に応じてプレーンテキストとHTML両方を保存
- ラベル情報は配列として保存し、Gmailのラベル機能との同期を維持
- メールアドレスは配列として保存し、複数の宛先に対応 