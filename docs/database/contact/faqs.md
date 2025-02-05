# faqs テーブル

## 役割

FAQ (よくある質問) データを管理します。チャットUIでFAQ検索やFAQサジェスト機能に使用するFAQ情報を定義します。

## テーブル定義 (SQL)

```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## カラム

| カラム名      | データ型                 | 修飾子                     | 説明                               |
| ----------- | ----------------------- | ----------------------- | ---------------------------------- |
| `id`        | `uuid`                  | PRIMARY KEY, DEFAULT: `gen_random_uuid()` | FAQ ID (UUID)                      |
| `category_id` | `uuid`                  | NOT NULL, FOREIGN KEY -> `categories.id` | カテゴリID (`categories` テーブルの `id` を参照) |
| `question`    | `text`                  | NOT NULL                | 質問内容                               |
| `answer`      | `text`                  | NOT NULL                | 回答内容                               |
| `created_at`  | `timestamp with time zone` | DEFAULT: `now()`           | 作成日時                               |

## インデックス

*   `category_id` カラムにインデックス

## RLSポリシー

```sql
-- 誰でも参照可能
CREATE POLICY "Enable read access for all users" ON faqs FOR SELECT USING (true);
```

## 関連テーブル

### 親テーブル

*   `categories` テーブル (多対1)

### 子テーブル

*   なし 