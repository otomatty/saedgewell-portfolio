-- 拡張機能の有効化
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime";
create extension if not exists "pgcrypto";

-- ロールテーブル
create table public.roles (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.roles is 'システムロールを管理するテーブル';

-- 権限テーブル
create table public.permissions (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.permissions is 'システム権限を管理するテーブル';

-- ロール権限テーブル
create table public.role_permissions (
  id uuid default gen_random_uuid() primary key,
  role_id uuid references public.roles on delete cascade not null,
  permission_id uuid references public.permissions on delete cascade not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique(role_id, permission_id)
);

comment on table public.role_permissions is 'ロールと権限の関連を管理するテーブル';

-- プロファイルテーブル
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role_id uuid references public.roles on delete restrict,
  is_active boolean default true not null,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.profiles is 'ユーザープロフィール情報を管理するテーブル';

-- OTP設定テーブル
create table public.otp_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  is_enabled boolean default false not null,
  secret_key text,
  backup_codes text[] default array[]::text[],
  last_used_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.otp_settings is 'ユーザーごとのOTP設定を管理するテーブル';

-- 信頼済みデバイステーブル
create table public.trusted_devices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  device_id text not null,
  device_name text not null,
  device_type text not null,
  os_info text,
  browser_info text,
  last_ip inet,
  last_used_at timestamptz,
  expires_at timestamptz not null default timezone('utc'::text, now() + interval '30 days'),
  is_active boolean default true not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique(user_id, device_id)
);

comment on table public.trusted_devices is '信頼できるデバイスを管理するテーブル';

-- 監査ログテーブル
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  status text default 'success' not null,
  error_message text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.audit_logs is 'システムの監査ログを管理するテーブル';

-- インデックスの作成
create index idx_profiles_email on public.profiles(email);
create index idx_profiles_role_id on public.profiles(role_id);
create index idx_profiles_is_active on public.profiles(is_active);
create index idx_roles_name on public.roles(name);
create index idx_permissions_name on public.permissions(name);
create index idx_role_permissions_role_id on public.role_permissions(role_id);
create index idx_role_permissions_permission_id on public.role_permissions(permission_id);
create index idx_otp_settings_user_id on public.otp_settings(user_id);
create index idx_otp_settings_is_enabled on public.otp_settings(is_enabled);
create index idx_trusted_devices_user_id on public.trusted_devices(user_id);
create index idx_trusted_devices_device_id on public.trusted_devices(device_id);
create index idx_trusted_devices_is_active on public.trusted_devices(is_active);
create index idx_trusted_devices_expires_at on public.trusted_devices(expires_at);
create index idx_audit_logs_user_id on public.audit_logs(user_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_audit_logs_entity_type_id on public.audit_logs(entity_type, entity_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at);

-- 更新日時自動更新トリガー関数
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 更新日時自動更新トリガー設定
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_roles_updated_at
  before update on public.roles
  for each row execute function public.update_updated_at_column();

create trigger update_permissions_updated_at
  before update on public.permissions
  for each row execute function public.update_updated_at_column();

create trigger update_otp_settings_updated_at
  before update on public.otp_settings
  for each row execute function public.update_updated_at_column();

create trigger update_trusted_devices_updated_at
  before update on public.trusted_devices
  for each row execute function public.update_updated_at_column();

-- RLSの有効化
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.otp_settings enable row level security;
alter table public.trusted_devices enable row level security;
alter table public.audit_logs enable row level security;

-- RLSポリシーの作成
create policy "プロファイルは本人または管理者が参照可能"
  on public.profiles for select
  to authenticated
  using (
    auth.uid() = id or
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "プロファイルは本人のみが更新可能"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "ロールは認証済みユーザーが参照可能"
  on public.roles for select
  to authenticated
  using (true);

create policy "ロールは管理者のみが管理可能"
  on public.roles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "権限は認証済みユーザーが参照可能"
  on public.permissions for select
  to authenticated
  using (true);

create policy "権限は管理者のみが管理可能"
  on public.permissions for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "ロール権限は認証済みユーザーが参照可能"
  on public.role_permissions for select
  to authenticated
  using (true);

create policy "ロール権限は管理者のみが管理可能"
  on public.role_permissions for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "OTP設定は本人のみが参照可能"
  on public.otp_settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "OTP設定は本人のみが管理可能"
  on public.otp_settings for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "信頼済みデバイスは本人のみが参照可能"
  on public.trusted_devices for select
  to authenticated
  using (auth.uid() = user_id);

create policy "信頼済みデバイスは本人のみが管理可能"
  on public.trusted_devices for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "監査ログは管理者のみが参照可能"
  on public.audit_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "監査ログは認証済みユーザーが作成可能"
  on public.audit_logs for insert
  to authenticated
  with check (auth.uid() = user_id);
