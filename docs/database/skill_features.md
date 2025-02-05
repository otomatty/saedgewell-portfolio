# スキル機能説明

## 概要
スキルの機能説明を管理するためのテーブルです。各機能について「できること」「できないこと」をboolean値で管理します。

## テーブル定義

### skill_features テーブル
スキルの機能を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | 機能説明の一意識別子 |
| skill_id | uuid | NO | - | 対象スキルのID（外部キー） |
| description | text | NO | - | 具体的な説明文 |
| is_capable | boolean | NO | true | true: できること, false: できないこと |
| priority | integer | NO | 0 | 表示順序（大きいほど上位に表示） |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.skill_features (
  id uuid not null default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  description text not null,
  is_capable boolean not null default true,
  priority integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint skill_features_pkey primary key (id)
);

-- インデックス
create index skill_features_skill_id_idx on public.skill_features using btree (skill_id);
create index skill_features_is_capable_priority_idx on public.skill_features using btree (is_capable, priority desc);

-- RLS
alter table public.skill_features enable row level security;

create policy "機能説明の参照は全員可能" on public.skill_features
  for select using (true);

create policy "機能説明の作成・編集は認証済みユーザーのみ可能" on public.skill_features
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_skill_features_updated_at
  before update on public.skill_features
  for each row
  execute function update_updated_at_column();
```

## 使用例

```sql
-- Reactスキルの機能説明
INSERT INTO skill_features (skill_id, description, is_capable, priority) VALUES
-- できること
('react-skill-id', 'コンポーネントベースの開発により、再利用可能なUIを構築できる', true, 100),
('react-skill-id', 'Hooksを使用して、状態管理とライフサイクルを効率的に制御できる', true, 90),
('react-skill-id', 'Virtual DOMにより、効率的なDOM更新を実現できる', true, 80),

-- できないこと
('react-skill-id', 'SEOが重要なページでは、Next.jsなどのフレームワークが必要', false, 100),
('react-skill-id', 'ブラウザのJavaScriptが無効な環境では動作しない', false, 90);

-- TypeScriptスキルの機能説明
INSERT INTO skill_features (skill_id, description, is_capable, priority) VALUES
-- できること
('typescript-skill-id', '静的型チェックにより、実行前にエラーを検出できる', true, 100),
('typescript-skill-id', 'IDEの支援機能を最大限に活用できる', true, 90),
('typescript-skill-id', 'JavaScriptの新機能をいち早く利用できる', true, 80),

-- できないこと
('typescript-skill-id', '実行時の型チェックは行えない（ランタイムでの型情報は失われる）', false, 100),
('typescript-skill-id', 'コンパイル時間が必要なため、開発の初期速度が遅くなる可能性がある', false, 90);
```

## 特徴

1. 「できること」と「できないこと」の区別
   - `is_capable`カラムでboolean値として管理
   - `true`: スキルでできること
   - `false`: スキルでできないこと、制限事項

2. 優先順位による表示順序の制御
   - `priority`カラムで表示順序を制御
   - 重要な説明を上位に表示可能

3. 関連付け
   - `skill_id`で特定のスキルと紐付け
   - カスケード削除により、スキル削除時に関連する説明も自動削除

4. 時系列管理
   - 作成日時と更新日時を記録
   - 説明の更新履歴を追跡可能

## 関連テーブル

- [skills](./skills.md) 