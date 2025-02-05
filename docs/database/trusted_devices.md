# 信頼できるデバイステーブル (trusted_devices)

## 概要
ユーザーが信頼するデバイスを管理するテーブルです。
信頼できるデバイスからのアクセスの場合、特定の操作に対するOTP認証を省略できます。

## テーブル定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|------------|------|
| id | uuid | NO | uuid_generate_v4() | プライマリーキー |
| user_id | uuid | NO | - | プロフィールテーブルの外部キー |
| device_id | text | NO | - | デバイスの一意識別子 |
| device_name | text | NO | - | デバイスの表示名 |
| device_type | text | NO | - | デバイスの種類（'desktop', 'mobile', 'tablet'） |
| os_info | text | YES | NULL | OS情報 |
| browser_info | text | YES | NULL | ブラウザ情報 |
| last_ip | inet | NO | - | 最後に使用したIPアドレス |
| last_used_at | timestamptz | NO | now() | 最後に使用した日時 |
| expires_at | timestamptz | NO | now() + interval '30 days' | 信頼期限 |
| is_active | boolean | NO | true | 有効かどうか |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

## インデックス

- PRIMARY KEY (id)
- UNIQUE (user_id, device_id)
- INDEX (user_id)
- INDEX (device_id)
- INDEX (is_active)
- INDEX (expires_at)

## 外部キー制約

- user_id → public.profiles(id) ON DELETE CASCADE

## RLSポリシー

### 参照ポリシー（SELECT）
```sql
create policy "信頼できるデバイスは本人のみが閲覧可能"
on public.trusted_devices for select
using (auth.uid() = user_id);
```

### 更新ポリシー（UPDATE）
```sql
create policy "信頼できるデバイスは本人のみが更新可能"
on public.trusted_devices for update
using (auth.uid() = user_id);
```

### 削除ポリシー（DELETE）
```sql
create policy "信頼できるデバイスは本人のみが削除可能"
on public.trusted_devices for delete
using (auth.uid() = user_id);
```

## トリガー

- updated_at列を更新するトリガー
```sql
create trigger handle_updated_at before update
on trusted_devices
for each row
execute procedure moddatetime (updated_at);
```

## 使用例

1. 新しいデバイスの登録
```sql
insert into public.trusted_devices (
  user_id,
  device_id,
  device_name,
  device_type,
  os_info,
  browser_info,
  last_ip
) values (
  auth.uid(),
  :device_id,
  :device_name,
  :device_type,
  :os_info,
  :browser_info,
  inet_client_addr()
);
```

2. デバイスの信頼性チェック
```sql
select exists (
  select 1
  from public.trusted_devices
  where user_id = auth.uid()
    and device_id = :device_id
    and is_active = true
    and expires_at > now()
) as is_trusted;
``` 