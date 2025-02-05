# OTP設定テーブル (otp_settings)

## 概要
ユーザーごとのOTP（ワンタイムパスワード）設定を管理するテーブルです。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| user_id | uuid | NO | - | プロフィールテーブルの外部キー |
| is_enabled | boolean | NO | false | OTPが有効かどうか |
| secret_key | text | YES | NULL | TOTP用の秘密鍵（暗号化して保存） |
| backup_codes | text[] | YES | NULL | バックアップコード（ハッシュ化して保存） |
| last_used_at | timestamptz | YES | NULL | 最後にOTPを使用した日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (user_id)
- INDEX (is_enabled)

## 外部キー制約

- user_id → public.profiles(id) ON DELETE CASCADE

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "OTP設定は本人のみが閲覧可能"
on public.otp_settings for select
using (auth.uid() = user_id);
```

### 更新ポリシー（UPDATE）
```sql
create policy "OTP設定は本人のみが更新可能"
on public.otp_settings for update
using (auth.uid() = user_id);
```

## トリガー

- updated_at列を更新するトリガー
```sql
create trigger handle_updated_at before update
on otp_settings
for each row
execute procedure moddatetime (updated_at);
``` 