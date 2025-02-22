# email_settings テーブル

## 概要
メール機能に関する各種設定を管理するテーブルです。自動アーカイブ、署名、通知設定などのユーザー設定を保存します。

## テーブル定義

```sql
create table email_settings (
  id uuid primary key default gen_random_uuid(),
  auto_archive_after_days integer,
  signature text,
  notification_enabled boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## カラム説明

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | false | gen_random_uuid() | プライマリキー |
| auto_archive_after_days | integer | true | - | メールを自動アーカイブする日数 |
| signature | text | true | - | メール署名のテンプレート |
| notification_enabled | boolean | false | true | メール通知の有効/無効 |
| created_at | timestamp with time zone | false | now() | レコード作成日時 |
| updated_at | timestamp with time zone | false | now() | レコード更新日時 |

## RLSポリシー

```sql
alter table email_settings enable row level security;

create policy "Email settings are only visible to authenticated users"
  on email_settings for select
  using (auth.role() = 'authenticated');

create policy "Email settings can only be inserted by authenticated users"
  on email_settings for insert
  with check (auth.role() = 'authenticated');

create policy "Email settings can only be updated by authenticated users"
  on email_settings for update
  using (auth.role() = 'authenticated');
```

## 関連テーブル
- [gmail_credentials](./gmail_credentials.md) - Gmail API認証情報

## 注意事項
- 自動アーカイブの日数は任意設定（nullの場合は自動アーカイブを行わない）
- 署名はHTMLフォーマットで保存可能
- 設定変更時は`updated_at`を更新
- 将来的な拡張性を考慮し、設定項目の追加が容易な構造
- 複数のGmailアカウントに対応する場合は、アカウントごとの設定が必要

## 設定例

### 署名のテンプレート例
```html
<div>
  <p>Best regards,</p>
  <p>Your Name</p>
  <p>Your Title</p>
  <p>Your Company</p>
  <p><a href="mailto:your.email@example.com">your.email@example.com</a></p>
</div>
```

### 自動アーカイブの設定例
- 30日後に自動アーカイブ: `auto_archive_after_days = 30`
- 自動アーカイブなし: `auto_archive_after_days = null` 