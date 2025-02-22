# gmail_credentials テーブル

## 概要
Gmail APIとの連携に必要な認証情報を管理するテーブルです。OAuth2.0の認証情報を安全に保存し、APIアクセスの管理を行います。

## テーブル定義

```sql
create table gmail_credentials (
  id uuid primary key default gen_random_uuid(),
  access_token text not null,
  refresh_token text not null,
  token_type text not null,
  expiry_date timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | false | gen_random_uuid() | プライマリキー |
| access_token | text | false | - | Gmail APIアクセストークン（暗号化） |
| refresh_token | text | false | - | リフレッシュトークン（暗号化） |
| token_type | text | false | - | トークンタイプ（通常は"Bearer"） |
| expiry_date | timestamp with time zone | false | - | アクセストークンの有効期限 |
| created_at | timestamp with time zone | false | now() | レコード作成日時 |
| updated_at | timestamp with time zone | false | now() | レコード更新日時 |

## インデックス

```sql
create index gmail_credentials_expiry_date_idx on gmail_credentials(expiry_date);
```

## RLSポリシー

```sql
alter table gmail_credentials enable row level security;

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
```

## 関連テーブル
- [email_settings](./email_settings.md) - メール設定情報

## 注意事項
- アクセストークンとリフレッシュトークンは必ず暗号化して保存
- アクセストークンの有効期限が切れる前に自動的に更新する仕組みが必要
- トークンの更新時は`updated_at`も更新
- セキュリティ上の理由から、トークン情報へのアクセスは厳密に制限
- バックアップ時はトークン情報の取り扱いに注意
- 複数のGmailアカウントに対応する場合は、アカウント識別情報の追加が必要 