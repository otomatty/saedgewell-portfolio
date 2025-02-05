# OTPチャレンジテーブル (otp_challenges)

## 概要
OTP認証チャレンジを管理するテーブルです。
特定の操作に対してOTP認証を要求する際に使用します。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| user_id | uuid | NO | - | プロフィールテーブルの外部キー |
| action | text | NO | - | 要求された操作（例: 'change_password', 'update_profile'） |
| status | text | NO | 'pending' | ステータス（'pending', 'completed', 'expired'） |
| expires_at | timestamptz | NO | now() + interval '5 minutes' | 有効期限 |
| completed_at | timestamptz | YES | NULL | 完了日時 |
| ip_address | inet | YES | NULL | クライアントIPアドレス |
| user_agent | text | YES | NULL | ユーザーエージェント |
| created_at | timestamptz | NO | now() | 作成日時 |

## インデックス

- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (status)
- INDEX (expires_at)
- INDEX (created_at)

## 外部キー制約

- user_id → public.profiles(id) ON DELETE CASCADE

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "OTPチャレンジは本人のみが閲覧可能"
on public.otp_challenges for select
using (auth.uid() = user_id);
```

### 挿入ポリシー（INSERT）
```sql
create policy "OTPチャレンジは認証済みユーザーが作成可能"
on public.otp_challenges for insert
to authenticated
with check (auth.uid() = user_id);
```

### 更新ポリシー（UPDATE）
```sql
create policy "OTPチャレンジは本人のみが更新可能"
on public.otp_challenges for update
using (auth.uid() = user_id);
```

## 使用例

1. OTPチャレンジの作成
```sql
insert into public.otp_challenges (
  user_id,
  action,
  ip_address,
  user_agent
) values (
  auth.uid(),
  'change_password',
  inet_client_addr(),
  current_setting('request.headers')::json->>'user-agent'
);
```

2. OTPチャレンジの完了
```sql
update public.otp_challenges
set
  status = 'completed',
  completed_at = now()
where
  id = :challenge_id
  and user_id = auth.uid()
  and status = 'pending'
  and expires_at > now();
``` 