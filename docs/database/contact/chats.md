# chats テーブル

## 役割

チャットセッション (会話) を管理します。お問い合わせカテゴリ、ユーザー、チャットステータス、開始ページURLなどのチャットセッションに関する情報を管理します。

## テーブル定義 (SQL)

```sql
CREATE TABLE contact_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES contact_categories(id),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  page_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## カラム

| カラム名      | データ型                 | 修飾子                                  | 説明                                                                 |
| ----------- | ----------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `id`        | `uuid`                  | PRIMARY KEY, DEFAULT: `gen_random_uuid()` | チャットセッションID (UUID)                                                  |
| `category_id` | `uuid`                  | NOT NULL, FOREIGN KEY -> `contact_categories.id` | カテゴリID (`contact_categories` テーブルの `id` を参照)                                |
| `profile_id`  | `uuid`                  | NOT NULL, FOREIGN KEY -> `profiles.id`   | プロフィールID (`profiles` テーブルの `id` を参照)                                  |
| `page_url`    | `text`                  |                                       | チャット開始時のページURL                                                        |
| `status`      | `varchar(20)`          | NOT NULL, DEFAULT: `'open'`, ENUM: `'open'`, `'pending'`, `'escalated'`, `'closed'` | チャットステータス (`open`, `pending`, `escalated`, `closed` のいずれか) |
| `created_at`  | `timestamp with time zone` | DEFAULT: `now()`                        | 作成日時                                                               |

## インデックス

*   `category_id` カラムにインデックス
*   `profile_id` カラムにインデックス

## RLSポリシー

```sql
-- 自分のチャットセッションのみ参照可能
CREATE POLICY "Enable read access for authenticated users" ON chats FOR SELECT USING (auth.uid() = profile_id);
-- 自分のチャットセッションのみ更新可能
CREATE POLICY "Enable update access for authenticated users" ON chats FOR UPDATE USING (auth.uid() = profile_id);
```

## 関連テーブル

### 親テーブル

*   `contact_categories` テーブル (多対1)
*   `profiles` テーブル (多対1)

### 子テーブル

*   `contact_chat_messages` テーブル (1対多) 