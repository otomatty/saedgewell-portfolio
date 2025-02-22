# email_replies テーブル

## 概要
送信したメールの返信情報を管理するテーブルです。アプリケーションから送信したメールの情報を保存し、返信の追跡を可能にします。

## テーブル定義

```sql
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
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | false | gen_random_uuid() | プライマリキー |
| original_email_id | uuid | true | - | 返信元のメールID（外部キー） |
| gmail_message_id | text | false | - | Gmail APIから取得したメッセージID |
| from_email | text | false | - | 送信者のメールアドレス |
| to_email | text[] | false | - | 宛先メールアドレス（複数可） |
| cc_email | text[] | true | - | CCメールアドレス（複数可） |
| bcc_email | text[] | true | - | BCCメールアドレス（複数可） |
| subject | text | false | - | メールの件名 |
| body_text | text | true | - | メール本文（プレーンテキスト） |
| body_html | text | true | - | メール本文（HTML） |
| sent_at | timestamp with time zone | false | - | メール送信日時 |
| created_at | timestamp with time zone | false | now() | レコード作成日時 |

## インデックス

```sql
create index email_replies_original_email_id_idx on email_replies(original_email_id);
create index email_replies_gmail_message_id_idx on email_replies(gmail_message_id);
create index email_replies_sent_at_idx on email_replies(sent_at);
```

## RLSポリシー

```sql
alter table email_replies enable row level security;

create policy "Email replies are only visible to authenticated users"
  on email_replies for select
  using (auth.role() = 'authenticated');

create policy "Email replies can only be inserted by authenticated users"
  on email_replies for insert
  with check (auth.role() = 'authenticated');

create policy "Email replies can only be updated by authenticated users"
  on email_replies for update
  using (auth.role() = 'authenticated');
```

## 関連テーブル
- [emails](./emails.md) - メール本体情報

## 注意事項
- 返信元のメールが削除された場合、original_email_idはnullに設定（set null）
- メール本文はプレーンテキストとHTML両方を保存
- 送信日時は必須項目として管理
- メールアドレスは配列として保存し、複数の宛先に対応
- Gmail APIを使用して実際にメールを送信した後、このテーブルに記録 