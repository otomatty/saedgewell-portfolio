# files テーブル

## 役割

チャットメッセージに添付されたファイルを管理します。ファイル名、ファイルURLなどのファイル情報を管理します。

## テーブル定義 (SQL)

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## カラム

| カラム名     | データ型                 | 修飾子                                     | 説明                                                                 |
| ---------- | ----------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `id`       | `uuid`                  | PRIMARY KEY, DEFAULT: `gen_random_uuid()`    | ファイルID (UUID)                                                              |
| `message_id` | `uuid`                  | NOT NULL, FOREIGN KEY -> `chat_messages.id` | チャットメッセージID (`chat_messages` テーブルの `id` を参照)                             |
| `file_name`  | `varchar(255)`          | NOT NULL                                 | ファイル名                                                               |
| `file_url`   | `text`                  | NOT NULL                                 | ファイルURL (Cloudflare Pages Storage or Supabase Storage のURL) |
| `created_at` | `timestamp with time zone` | DEFAULT: `now()`                           | 作成日時                                                               |

## インデックス

*   `message_id` カラムにインデックス

## RLSポリシー

```sql
-- 自分のチャットセッションのメッセージに紐づくファイルのみ参照可能
CREATE POLICY "Enable read access for authenticated users" ON files FOR SELECT USING (
  message_id IN (SELECT id FROM chat_messages WHERE chat_id IN (SELECT id FROM chats WHERE profile_id = auth.uid()))
);
```

## 関連テーブル

### 親テーブル

*   `chat_messages` テーブル (1対1)

### 子テーブル

*   なし 