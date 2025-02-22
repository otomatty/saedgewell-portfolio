# email_attachments テーブル

## 概要
メールの添付ファイル情報を管理するテーブルです。添付ファイルの実体はSupabase Storageに保存し、このテーブルではメタデータを管理します。

## テーブル定義

```sql
create table email_attachments (
  id uuid primary key default gen_random_uuid(),
  email_id uuid references emails(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  file_path text not null,
  created_at timestamp with time zone default now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | false | gen_random_uuid() | プライマリキー |
| email_id | uuid | false | - | 関連するメールのID（外部キー） |
| file_name | text | false | - | 添付ファイルの元のファイル名 |
| file_type | text | false | - | ファイルのMIMEタイプ |
| file_size | integer | false | - | ファイルサイズ（バイト） |
| file_path | text | false | - | Supabase Storage内のファイルパス |
| created_at | timestamp with time zone | false | now() | レコード作成日時 |

## インデックス

```sql
create index email_attachments_email_id_idx on email_attachments(email_id);
```

## RLSポリシー

```sql
alter table email_attachments enable row level security;

create policy "Email attachments are only visible to authenticated users"
  on email_attachments for select
  using (auth.role() = 'authenticated');

create policy "Email attachments can only be inserted by authenticated users"
  on email_attachments for insert
  with check (auth.role() = 'authenticated');

create policy "Email attachments can only be deleted by authenticated users"
  on email_attachments for delete
  using (auth.role() = 'authenticated');
```

## 関連テーブル
- [emails](./emails.md) - メール本体情報

## 注意事項
- 添付ファイルの実体はSupabase Storageに保存
- ファイルパスは`/emails/{email_id}/attachments/{file_name}`の形式で保存
- 親テーブル（emails）のレコードが削除された場合、関連する添付ファイルも自動的に削除（cascade）
- ファイルサイズの制限はSupabase Storageの制限に従う
- セキュリティ上の理由から、ファイルタイプは厳密にチェックする必要がある 