# chat_messages テーブル

## 役割

チャットメッセージを管理します。各チャットセッションに紐づくメッセージの内容、送信者、添付ファイル、関連FAQなどの情報を管理します。

## テーブル定義 (SQL)

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id),
  sender_type VARCHAR(20) NOT NULL,
  message_text TEXT NOT NULL,
  file_id UUID REFERENCES files(id),
  faq_id UUID REFERENCES faqs(id),
  is_escalation_request BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## カラム

| カラム名                | データ型                 | 修飾子                                  | 説明                                                                 |
| --------------------- | ----------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `id`                  | `uuid`                  | PRIMARY KEY, DEFAULT: `gen_random_uuid()` | チャットメッセージID (UUID)                                                    |
| `chat_id`             | `uuid`                  | NOT NULL, FOREIGN KEY -> `chats.id`      | チャットセッションID (`chats` テーブルの `id` を参照)                                   |
| `sender_type`         | `varchar(20)`          | NOT NULL, ENUM: `'user'`, `'assistant'`, `'admin'` | 送信者のタイプ (`user`, `assistant`, `admin` のいずれか)                       |
| `message_text`        | `text`                  | NOT NULL                                | メッセージ本文                                                               |
| `file_id`             | `uuid`                  | FOREIGN KEY -> `files.id`, NULLABLE      | ファイルID (`files` テーブルの `id` を参照, 添付ファイルがない場合は NULL)                     |
| `faq_id`              | `uuid`                  | FOREIGN KEY -> `faqs.id`, NULLABLE       | FAQ ID (`faqs` テーブルの `id` を参照, 関連FAQがない場合は NULL)                        |
| `is_escalation_request` | `boolean`               | NOT NULL, DEFAULT: `false`              | エスカレーションリクエストメッセージフラグ (ユーザーがエスカレーションをリクエストしたメッセージの場合 true) |
| `timestamp`           | `timestamp with time zone` | DEFAULT: `now()`                        | 作成日時 (メッセージ送信日時)                                                      |

## インデックス

*   `chat_id` カラムにインデックス
*   `file_id` カラムにインデックス
*   `faq_id` カラムにインデックス

## RLSポリシー

```sql
-- 自分のチャットセッションのメッセージのみ参照可能
CREATE POLICY "Enable read access for authenticated users" ON chat_messages FOR SELECT USING (
  chat_id IN (SELECT id FROM chats WHERE profile_id = auth.uid())
);
```

## 関連テーブル

### 親テーブル

*   `chats` テーブル (多対1)
*   `files` テーブル (多対1, nullable)
*   `faqs` テーブル (多対1, nullable)

### 子テーブル

*   `files` テーブル (1対1) 