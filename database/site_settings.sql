-- サイトの状態を表すenum型
create type site_status as enum ('development', 'staging', 'production');

-- サイト設定テーブル
create table site_settings (
  -- 基本設定
  id uuid primary key default gen_random_uuid(),
  site_status site_status not null default 'development',
  maintenance_mode boolean not null default false,
  is_development_banner_enabled boolean not null default true,

  -- SEO設定
  site_name text not null default 'Saedgewell',
  site_description text not null default '菅井瑛正のポートフォリオサイト',
  site_keywords text[] not null default array['プロダクトエンジニア', 'Web開発', 'Next.js', 'React', 'TypeScript'],
  og_image_url text,
  favicon_url text,
  robots_txt_content text,

  -- 機能設定
  enable_blog boolean not null default true,
  enable_works boolean not null default true,
  enable_contact boolean not null default true,
  enable_estimate boolean not null default true,

  -- SNS設定
  social_links jsonb not null default '{
    "github": "https://github.com/ottomatty",
    "twitter": null,
    "linkedin": null
  }'::jsonb,

  -- システム情報
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_modified_by uuid references auth.users(id),

  -- 制約
  constraint single_settings check (id = gen_random_uuid()) -- 1レコードのみ許可
);

-- RLSポリシーの設定
alter table site_settings enable row level security;

-- 管理者のみが編集可能
create policy "管理者のみが設定を編集可能" on site_settings
  for all using (
    auth.jwt() ->> 'role' = 'admin'
  );

-- 全ユーザーが閲覧可能
create policy "全ユーザーが設定を閲覧可能" on site_settings
  for select using (true);

-- 更新日時を自動更新
create trigger update_site_settings_updated_at
  before update on site_settings
  for each row
  execute function update_updated_at_column(); 