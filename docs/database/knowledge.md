# ナレッジベース管理

## 概要
Scrapboxから取得したナレッジベースの情報を管理するテーブル群です。プロジェクト、ページ、リンク関係などを体系的に管理し、定期的な同期を行います。

## テーブル定義

### knowledge_projects テーブル
Scrapboxプロジェクトの情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | プロジェクトの一意識別子 |
| project_name | text | NO | - | Scrapboxのプロジェクト名 |
| total_pages | integer | NO | 0 | プロジェクトの全ページ数 |
| last_synced_at | timestamp with time zone | NO | - | 最後の同期日時 |
| scrapbox_cookie | text | YES | - | プロジェクト固有のScrapbox Cookie |
| auto_sync_enabled | boolean | NO | false | 自動同期の有効/無効 |
| is_private | boolean | NO | false | 非公開プロジェクトかどうか |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.knowledge_projects (
  id uuid not null default gen_random_uuid(),
  project_name text not null,
  total_pages integer not null default 0,
  last_synced_at timestamp with time zone not null,
  scrapbox_cookie text,
  auto_sync_enabled boolean not null default false,
  is_private boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint knowledge_projects_pkey primary key (id),
  constraint knowledge_projects_project_name_key unique (project_name)
);

-- インデックス
create index knowledge_projects_project_name_idx on public.knowledge_projects using btree (project_name);

-- RLS
alter table public.knowledge_projects enable row level security;

create policy "プロジェクトの参照は全員可能" on public.knowledge_projects
  for select using (true);

create policy "プロジェクトの作成・編集は認証済みユーザーのみ可能" on public.knowledge_projects
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_knowledge_projects_updated_at
  before update on public.knowledge_projects
  for each row
  execute function update_updated_at_column();
```

### knowledge_pages テーブル
ページの基本情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | ページの一意識別子 |
| project_id | uuid | NO | - | プロジェクトの一意識別子（外部キー） |
| scrapbox_id | text | NO | - | ScrapboxのページID |
| title | text | NO | - | ページタイトル |
| image_url | text | YES | - | サムネイル画像のURL |
| descriptions | text[] | NO | '{}' | ページの説明文（配列） |
| pin_status | integer | NO | 0 | ピン留めステータス |
| views | integer | NO | 0 | 閲覧回数 |
| linked_count | integer | NO | 0 | 被リンク数 |
| commit_id | text | YES | - | 最新の編集コミットID |
| page_rank | double precision | NO | 0 | ページランク |
| persistent | boolean | NO | true | ページの有効性 |
| created_at | timestamp with time zone | NO | - | 作成日時 |
| updated_at | timestamp with time zone | NO | - | 更新日時 |
| accessed_at | timestamp with time zone | YES | - | 最終アクセス日時 |
| last_accessed_at | timestamp with time zone | YES | - | ユーザーの最終アクセス日時 |
| snapshot_created_at | timestamp with time zone | YES | - | スナップショット作成日時 |
| snapshot_count | integer | NO | 0 | スナップショット数 |

```sql
create table public.knowledge_pages (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null references public.knowledge_projects(id),
  scrapbox_id text not null,
  title text not null,
  image_url text,
  descriptions text[] not null default '{}',
  pin_status integer not null default 0,
  views integer not null default 0,
  linked_count integer not null default 0,
  commit_id text,
  page_rank double precision not null default 0,
  persistent boolean not null default true,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null,
  accessed_at timestamp with time zone,
  last_accessed_at timestamp with time zone,
  snapshot_created_at timestamp with time zone,
  snapshot_count integer not null default 0,
  constraint knowledge_pages_pkey primary key (id),
  constraint knowledge_pages_project_id_scrapbox_id_key unique (project_id, scrapbox_id)
);

-- インデックス
create index knowledge_pages_project_id_idx on public.knowledge_pages using btree (project_id);
create index knowledge_pages_title_idx on public.knowledge_pages using btree (title);
create index knowledge_pages_updated_at_idx on public.knowledge_pages using btree (updated_at);

-- RLS
alter table public.knowledge_pages enable row level security;

create policy "ページの参照は全員可能" on public.knowledge_pages
  for select using (true);

create policy "ページの作成・編集は認証済みユーザーのみ可能" on public.knowledge_pages
  for all using (
    auth.role() = 'authenticated'
  );
```

### knowledge_page_details テーブル
ページの詳細情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | 詳細情報の一意識別子 |
| page_id | uuid | NO | - | ページの一意識別子（外部キー） |
| lines | jsonb | NO | '[]' | ページの本文（行ごとの情報） |
| icons | text[] | NO | '{}' | ページアイコン |
| files | text[] | NO | '{}' | 添付ファイルのURL |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.knowledge_page_details (
  id uuid not null default gen_random_uuid(),
  page_id uuid not null references public.knowledge_pages(id),
  lines jsonb not null default '[]'::jsonb,
  icons text[] not null default '{}',
  files text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint knowledge_page_details_pkey primary key (id),
  constraint knowledge_page_details_page_id_key unique (page_id)
);

-- インデックス
create index knowledge_page_details_page_id_idx on public.knowledge_page_details using btree (page_id);

-- RLS
alter table public.knowledge_page_details enable row level security;

create policy "詳細の参照は全員可能" on public.knowledge_page_details
  for select using (true);

create policy "詳細の作成・編集は認証済みユーザーのみ可能" on public.knowledge_page_details
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_knowledge_page_details_updated_at
  before update on public.knowledge_page_details
  for each row
  execute function update_updated_at_column();
```

### knowledge_users テーブル
Scrapboxのユーザー情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | ユーザーの一意識別子 |
| scrapbox_id | text | NO | - | ScrapboxのユーザーID |
| name | text | NO | - | ユーザー名 |
| display_name | text | NO | - | 表示名 |
| photo_url | text | YES | - | プロフィール画像のURL |
| created_at | timestamp with time zone | NO | now() | 作成日時 |
| updated_at | timestamp with time zone | NO | now() | 更新日時 |

```sql
create table public.knowledge_users (
  id uuid not null default gen_random_uuid(),
  scrapbox_id text not null,
  name text not null,
  display_name text not null,
  photo_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint knowledge_users_pkey primary key (id),
  constraint knowledge_users_scrapbox_id_key unique (scrapbox_id)
);

-- インデックス
create index knowledge_users_scrapbox_id_idx on public.knowledge_users using btree (scrapbox_id);

-- RLS
alter table public.knowledge_users enable row level security;

create policy "ユーザー情報の参照は全員可能" on public.knowledge_users
  for select using (true);

create policy "ユーザー情報の作成・編集は認証済みユーザーのみ可能" on public.knowledge_users
  for all using (
    auth.role() = 'authenticated'
  );

-- トリガー
create trigger update_knowledge_users_updated_at
  before update on public.knowledge_users
  for each row
  execute function update_updated_at_column();
```

### knowledge_page_collaborators テーブル
ページの編集者情報を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | 編集者情報の一意識別子 |
| page_id | uuid | NO | - | ページの一意識別子（外部キー） |
| user_id | uuid | NO | - | ユーザーの一意識別子（外部キー） |
| is_last_editor | boolean | NO | false | 最終編集者かどうか |
| created_at | timestamp with time zone | NO | now() | 作成日時 |

```sql
create table public.knowledge_page_collaborators (
  id uuid not null default gen_random_uuid(),
  page_id uuid not null references public.knowledge_pages(id),
  user_id uuid not null references public.knowledge_users(id),
  is_last_editor boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint knowledge_page_collaborators_pkey primary key (id),
  constraint knowledge_page_collaborators_page_id_user_id_key unique (page_id, user_id)
);

-- インデックス
create index knowledge_page_collaborators_page_id_idx on public.knowledge_page_collaborators using btree (page_id);
create index knowledge_page_collaborators_user_id_idx on public.knowledge_page_collaborators using btree (user_id);

-- RLS
alter table public.knowledge_page_collaborators enable row level security;

create policy "編集者情報の参照は全員可能" on public.knowledge_page_collaborators
  for select using (true);

create policy "編集者情報の作成・編集は認証済みユーザーのみ可能" on public.knowledge_page_collaborators
  for all using (
    auth.role() = 'authenticated'
  );
```

### knowledge_page_links テーブル
ページ間のリンク関係を管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | リンクの一意識別子 |
| source_page_id | uuid | NO | - | リンク元ページの一意識別子（外部キー） |
| target_page_id | uuid | NO | - | リンク先ページの一意識別子（外部キー） |
| hop_level | integer | NO | 1 | リンクの距離（1-hop or 2-hop） |
| created_at | timestamp with time zone | NO | now() | 作成日時 |

```sql
create table public.knowledge_page_links (
  id uuid not null default gen_random_uuid(),
  source_page_id uuid not null references public.knowledge_pages(id),
  target_page_id uuid not null references public.knowledge_pages(id),
  hop_level integer not null default 1,
  created_at timestamp with time zone not null default now(),
  constraint knowledge_page_links_pkey primary key (id),
  constraint knowledge_page_links_source_target_key unique (source_page_id, target_page_id)
);

-- インデックス
create index knowledge_page_links_source_page_id_idx on public.knowledge_page_links using btree (source_page_id);
create index knowledge_page_links_target_page_id_idx on public.knowledge_page_links using btree (target_page_id);

-- RLS
alter table public.knowledge_page_links enable row level security;

create policy "リンク情報の参照は全員可能" on public.knowledge_page_links
  for select using (true);

create policy "リンク情報の作成・編集は認証済みユーザーのみ可能" on public.knowledge_page_links
  for all using (
    auth.role() = 'authenticated'
  );
```

### knowledge_sync_logs テーブル
同期処理のログを管理するテーブル

| カラム名 | 型 | NULL | デフォルト | 説明 |
|----------|-----|------|------------|------|
| id | uuid | NO | gen_random_uuid() | ログの一意識別子 |
| project_id | uuid | NO | - | プロジェクトの一意識別子（外部キー） |
| sync_started_at | timestamp with time zone | NO | - | 同期開始日時 |
| sync_completed_at | timestamp with time zone | YES | - | 同期完了日時 |
| status | text | NO | - | 同期ステータス |
| error_message | text | YES | - | エラーメッセージ |
| pages_processed | integer | NO | 0 | 処理したページ数 |
| pages_updated | integer | NO | 0 | 更新したページ数 |
| created_at | timestamp with time zone | NO | now() | 作成日時 |

```sql
create table public.knowledge_sync_logs (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null references public.knowledge_projects(id),
  sync_started_at timestamp with time zone not null,
  sync_completed_at timestamp with time zone,
  status text not null,
  error_message text,
  pages_processed integer not null default 0,
  pages_updated integer not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint knowledge_sync_logs_pkey primary key (id)
);

-- インデックス
create index knowledge_sync_logs_project_id_idx on public.knowledge_sync_logs using btree (project_id);
create index knowledge_sync_logs_sync_started_at_idx on public.knowledge_sync_logs using btree (sync_started_at);

-- RLS
alter table public.knowledge_sync_logs enable row level security;

create policy "同期ログの参照は全員可能" on public.knowledge_sync_logs
  for select using (true);

create policy "同期ログの作成・編集は認証済みユーザーのみ可能" on public.knowledge_sync_logs
  for all using (
    auth.role() = 'authenticated'
  );
```

## 主な特徴

1. プロジェクト管理（`knowledge_projects`テーブル）
   - Scrapboxプロジェクトの基本情報を管理
   - 同期状態の追跡

2. ページ管理（`knowledge_pages`、`knowledge_page_details`テーブル）
   - ページの基本情報と詳細情報を分離
   - 大きなデータ（本文など）は詳細テーブルで管理
   - メタデータ（views、linked_count等）の追跡

3. ユーザー管理（`knowledge_users`、`knowledge_page_collaborators`テーブル）
   - Scrapboxユーザーの情報を管理
   - ページごとの編集者情報を追跡

4. リンク管理（`knowledge_page_links`テーブル）
   - ページ間のリンク関係を管理
   - 1-hopと2-hopの関係を区別

5. 同期ログ（`knowledge_sync_logs`テーブル）
   - 同期処理の履歴を管理
   - エラー追跡とモニタリング

## 使用例

1. プロジェクトの登録
```sql
INSERT INTO knowledge_projects (project_name, last_synced_at) VALUES
('my-project', now());
```

2. ページの登録
```sql
-- 基本情報の登録
INSERT INTO knowledge_pages (
  project_id,
  scrapbox_id,
  title,
  descriptions,
  created_at,
  updated_at
) VALUES (
  'プロジェクトID',
  'ページID',
  'ページタイトル',
  ARRAY['説明1', '説明2'],
  now(),
  now()
);

-- 詳細情報の登録
INSERT INTO knowledge_page_details (
  page_id,
  lines,
  icons
) VALUES (
  'ページID',
  '[{"text": "行1", "userId": "ユーザーID"}, {"text": "行2", "userId": "ユーザーID"}]'::jsonb,
  ARRAY['アイコン1', 'アイコン2']
);
```

3. リンク関係の登録
```sql
INSERT INTO knowledge_page_links (
  source_page_id,
  target_page_id,
  hop_level
) VALUES (
  'ソースページID',
  'ターゲットページID',
  1
);
```

4. Supabase Edge Functionsを使用した同期処理
```sql
-- Supabase Edge Functionsを使用した同期処理
create or replace function public.sync_knowledge_projects()
returns void
language plpgsql
security definer
as $$
declare
  project record;
  one_hour_ago timestamptz;
  sync_log_id uuid;
begin
  -- 1時間前の時刻を計算
  one_hour_ago := now() - interval '1 hour';
  
  -- 自動同期が有効で、最後の同期から1時間以上経過したプロジェクトを取得
  for project in
    select id, project_name, scrapbox_cookie, is_private
    from public.knowledge_projects
    where auto_sync_enabled = true
    and (last_synced_at is null or last_synced_at < one_hour_ago)
  loop
    -- 同期ログの作成
    insert into public.knowledge_sync_logs (
      project_id,
      sync_started_at,
      status,
      pages_processed,
      pages_updated
    ) values (
      project.id,
      now(),
      'processing',
      0,
      0
    ) returning id into sync_log_id;

    begin
      -- Supabase Edge Functionで同期処理を実行
      select supabase_edge_function(
        'sync-knowledge-project',
        json_build_object(
          'project_id', project.id,
          'project_name', project.project_name,
          'scrapbox_cookie', coalesce(project.scrapbox_cookie, current_setting('app.settings.default_scrapbox_cookie')),
          'is_private', project.is_private
        )
      );

      -- 同期成功時の更新
      update public.knowledge_projects
      set last_synced_at = now()
      where id = project.id;

      update public.knowledge_sync_logs
      set 
        sync_completed_at = now(),
        status = 'completed'
      where id = sync_log_id;

    exception when others then
      -- エラー発生時の更新
      update public.knowledge_sync_logs
      set 
        sync_completed_at = now(),
        status = 'error',
        error_message = SQLERRM
      where id = sync_log_id;
    end;
  end loop;
end;
$$;

-- cronジョブの作成（1時間ごとに実行）
select cron.schedule(
  'sync-knowledge-projects',
  '0 * * * *',
  'select public.sync_knowledge_projects()'
);

-- RLSポリシーの作成
grant execute on function public.sync_knowledge_projects() to postgres;
``` 