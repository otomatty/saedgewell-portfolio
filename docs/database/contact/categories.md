# categories テーブル

## 役割

お問い合わせカテゴリを管理します。チャットUIのカテゴリ選択画面に表示するカテゴリ情報を定義します。

## テーブル定義 (SQL)

```sql
CREATE TABLE contact_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## カラム

| カラム名      | データ型                 | 修飾子         | 説明                                     |
| ----------- | ----------------------- | ------------- | ---------------------------------------- |
| `id`        | `uuid`                  | PRIMARY KEY, DEFAULT: `gen_random_uuid()` | カテゴリID (UUID)                            |
| `name`      | `varchar(255)`          | UNIQUE, NOT NULL | カテゴリ名 (例: 開発のご依頼, 講演・セミナーのご依頼)           |
| `description` | `text`                  |               | カテゴリの説明文 (チャット開始画面のカードに表示)                 |
| `icon`      | `varchar(255)`          |               | カテゴリのアイコン (例: 🛠️, 🎤)                       |
| `created_at`  | `timestamp with time zone` | DEFAULT: `now()` | 作成日時                                   |

## インデックス

*   `name` カラムに UNIQUE インデックス

## RLSポリシー

```sql
-- 誰でも参照可能
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
```

## 関連テーブル

### 親テーブル

*   なし

### 子テーブル

*   `faqs` テーブル (1対多)
*   `contact_chats` テーブル (1対多) 