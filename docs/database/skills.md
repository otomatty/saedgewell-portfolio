# スキル管理

## 概要
スキルに関する情報を管理するテーブル群です。スキルの種類（技術、マネジメント、デザインなど）を柔軟に定義し、各スキルの使用期間や実績を記録します。

## テーブル定義

### skills テーブル
スキルの基本情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | スキルの一意識別子 |
| slug | text | NO | - | URLで使用する一意のスラッグ |
| name | text | NO | - | スキル名 |
| description | text | NO | - | スキルの説明文 |
| icon_url | text | YES | - | アイコン画像のURL |
| started_at | date | NO | - | スキルの使用開始日 |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.skills (
  id uuid not null default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text not null,
  icon_url text,
  started_at date not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint skills_pkey primary key (id),
  constraint skills_slug_key unique (slug)
);

-- インデックス
create index skills_slug_idx on public.skills using btree (slug);

-- RLS
alter table public.skills enable row level security;

create policy "スキルの参照は全員可能" on public.skills
  for select using (true);

create policy "スキルの作成・編集は認証済みユーザーのみ可能" on public.skills
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_skills_updated_at
  before update on public.skills
  for each row
  execute function update_updated_at_column();
```

### skill_categories テーブル
スキルのカテゴリーを柔軟に管理するためのテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | カテゴリーの一意識別子 |
| name | text | NO | - | カテゴリー名 |
| description | text | YES | - | カテゴリーの説明文 |
| parent_id | uuid | YES | - | 親カテゴリーのID（階層構造用） |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.skill_categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  parent_id uuid references public.skill_categories(id),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint skill_categories_pkey primary key (id),
  constraint skill_categories_name_key unique (name)
);

-- インデックス
create index skill_categories_parent_id_idx on public.skill_categories using btree (parent_id);

-- RLS
alter table public.skill_categories enable row level security;

create policy "カテゴリーの参照は全員可能" on public.skill_categories
  for select using (true);

create policy "カテゴリーの作成・編集は認証済みユーザーのみ可能" on public.skill_categories
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_skill_categories_updated_at
  before update on public.skill_categories
  for each row
  execute function update_updated_at_column();
```

### skill_category_relations テーブル
スキルとカテゴリーの関連付けを管理するテーブル（多対多）

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| skill_id | uuid | NO | - | スキルの一意識別子（外部キー） |
| category_id | uuid | NO | - | カテゴリーの一意識別子（外部キー） |
| created_at | timestamp with time zone | NO | now() | 作成日時 |

```sql
create table public.skill_category_relations (
  skill_id uuid not null references public.skills(id) on delete cascade,
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint skill_category_relations_pkey primary key (skill_id, category_id)
);

-- インデックス
create index skill_category_relations_skill_id_idx on public.skill_category_relations using btree (skill_id);
create index skill_category_relations_category_id_idx on public.skill_category_relations using btree (category_id);

-- RLS
alter table public.skill_category_relations enable row level security;

create policy "関連の参照は全員可能" on public.skill_category_relations
  for select using (true);

create policy "関連の作成・編集は認証済みユーザーのみ可能" on public.skill_category_relations
  for all using (
    auth.role() = 'authenticated'
  );
```

### skill_experiences テーブル
スキルの使用実績を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | 実績の一意識別子 |
| skill_id | uuid | NO | - | スキルの一意識別子（外部キー） |
| project_name | text | NO | - | プロジェクト名 |
| description | text | NO | - | プロジェクトでの具体的な活用内容 |
| started_at | date | NO | - | プロジェクト開始日 |
| ended_at | date | YES | - | プロジェクト終了日（現在進行中の場合はNULL） |
| is_current | boolean | NO | false | 現在進行中かどうか |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.skill_experiences (
  id uuid not null default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  project_name text not null,
  description text not null,
  started_at date not null,
  ended_at date,
  is_current boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint skill_experiences_pkey primary key (id)
);

-- インデックス
create index skill_experiences_skill_id_idx on public.skill_experiences using btree (skill_id);
create index skill_experiences_started_at_idx on public.skill_experiences using btree (started_at);

-- RLS
alter table public.skill_experiences enable row level security;

create policy "実績の参照は全員可能" on public.skill_experiences
  for select using (true);

create policy "実績の作成・編集は認証済みユーザーのみ可能" on public.skill_experiences
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_skill_experiences_updated_at
  before update on public.skill_experiences
  for each row
  execute function update_updated_at_column();
```

## 主な変更点

1. スキルの基本情報（`skills`テーブル）
   - 習熟度と経験年数を削除
   - 使用開始日（`started_at`）を追加
   - より柔軟なカテゴリー管理のため、カテゴリーをリレーションテーブルに移動

2. カテゴリー管理（`skill_categories`テーブル）
   - 階層構造をサポート（`parent_id`による自己参照）
   - カテゴリーの説明を追加
   - 技術、マネジメント、デザインなど、様々なスキル種別に対応

3. スキルとカテゴリーの関連付け（`skill_category_relations`テーブル）
   - 多対多の関連付けにより、1つのスキルに複数のカテゴリーを設定可能
   - 例：「React」に「フロントエンド」と「JavaScript」の両方を設定可能

4. スキルの使用実績（`skill_experiences`テーブル）
   - プロジェクトごとの使用期間を記録
   - 現在進行中のプロジェクトを識別可能
   - プロジェクトでの具体的な活用内容を記述可能

## 使用例

1. 技術スキル
```sql
-- カテゴリー
INSERT INTO skill_categories (name, description) VALUES
('技術', 'プログラミング言語やフレームワークなどの技術的なスキル'),
('フロントエンド', 'フロントエンド開発に関するスキル'),
('JavaScript', 'JavaScript関連の技術');

-- スキル
INSERT INTO skills (slug, name, description, started_at) VALUES
('react', 'React', 'Reactによるフロントエンド開発', '2020-01-01');

-- カテゴリーの関連付け
INSERT INTO skill_category_relations (skill_id, category_id) VALUES
(スキルID, フロントエンドカテゴリーID),
(スキルID, JavaScriptカテゴリーID);

-- 使用実績
INSERT INTO skill_experiences (skill_id, project_name, description, started_at, ended_at) VALUES
(スキルID, 'ポートフォリオサイト', 'Next.jsとReactを使用したポートフォリオサイトの開発', '2023-01-01', '2023-03-31');
```

2. マネジメントスキル
```sql
-- カテゴリー
INSERT INTO skill_categories (name, description) VALUES
('マネジメント', 'プロジェクトやチームのマネジメントに関するスキル');

-- スキル
INSERT INTO skills (slug, name, description, started_at) VALUES
('scrum-master', 'スクラムマスター', 'アジャイル開発におけるスクラムマスターとしての経験', '2021-01-01');

-- 使用実績
INSERT INTO skill_experiences (skill_id, project_name, description, started_at, is_current) VALUES
(スキルID, '社内プロジェクト', '5人チームのスクラムマスターとして、プロジェクトの進行を管理', '2023-04-01', true);
``` 