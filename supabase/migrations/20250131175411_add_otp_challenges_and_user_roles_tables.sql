-- OTPチャレンジテーブル
create table public.otp_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  challenge_type text not null check (challenge_type in ('setup', 'login', 'recovery')),
  challenge_code text not null,
  verification_code text,
  attempts integer default 0 not null,
  is_verified boolean default false not null,
  expires_at timestamptz not null default timezone('utc'::text, now() + interval '5 minutes'),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.otp_challenges is 'OTP認証のチャレンジを管理するテーブル';
comment on column public.otp_challenges.challenge_type is 'チャレンジの種類（setup: 初期設定, login: ログイン, recovery: リカバリー）';
comment on column public.otp_challenges.challenge_code is 'チャレンジコード（セッション識別用）';
comment on column public.otp_challenges.verification_code is '検証コード（ハッシュ化されたOTPコード）';
comment on column public.otp_challenges.attempts is '試行回数';
comment on column public.otp_challenges.is_verified is '検証済みフラグ';
comment on column public.otp_challenges.expires_at is '有効期限';

-- ユーザーロール履歴テーブル
create table public.user_role_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  old_role_id uuid references public.roles on delete restrict,
  new_role_id uuid references public.roles on delete restrict not null,
  changed_by uuid references auth.users on delete set null,
  reason text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.user_role_history is 'ユーザーのロール変更履歴を管理するテーブル';
comment on column public.user_role_history.old_role_id is '変更前のロールID';
comment on column public.user_role_history.new_role_id is '変更後のロールID';
comment on column public.user_role_history.changed_by is '変更を実行したユーザーID';
comment on column public.user_role_history.reason is '変更理由';

-- ロールポリシーテーブル
create table public.role_policies (
  id uuid default gen_random_uuid() primary key,
  role_id uuid references public.roles on delete cascade not null,
  resource_type text not null,
  action text not null,
  conditions jsonb,
  effect text not null check (effect in ('allow', 'deny')),
  priority integer default 0 not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique(role_id, resource_type, action)
);

comment on table public.role_policies is 'ロールごとの詳細なアクセスポリシーを管理するテーブル';
comment on column public.role_policies.resource_type is 'リソースタイプ（例: projects, documents）';
comment on column public.role_policies.action is 'アクション（例: read, write, delete）';
comment on column public.role_policies.conditions is 'ポリシーの適用条件（JSONBで柔軟な条件を定義）';
comment on column public.role_policies.effect is 'ポリシーの効果（allow: 許可, deny: 拒否）';
comment on column public.role_policies.priority is 'ポリシーの優先度（高いほど優先）';

-- セッション制限テーブル
create table public.session_policies (
  id uuid default gen_random_uuid() primary key,
  role_id uuid references public.roles on delete cascade not null,
  max_sessions integer default null,
  session_timeout interval default '24 hours' not null,
  require_otp boolean default false not null,
  ip_restriction text[],
  time_restriction jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique(role_id)
);

comment on table public.session_policies is 'ロールごとのセッション制限を管理するテーブル';
comment on column public.session_policies.max_sessions is '同時セッションの最大数（nullは無制限）';
comment on column public.session_policies.session_timeout is 'セッションのタイムアウト時間';
comment on column public.session_policies.require_otp is 'OTP認証の要求フラグ';
comment on column public.session_policies.ip_restriction is '許可するIPアドレスの配列';
comment on column public.session_policies.time_restriction is '時間帯制限（例: {"weekday": {"start": "09:00", "end": "17:00"}}）';

-- インデックスの作成
create index idx_otp_challenges_user_id on public.otp_challenges(user_id);
create index idx_otp_challenges_challenge_code on public.otp_challenges(challenge_code);
create index idx_otp_challenges_expires_at on public.otp_challenges(expires_at);
create index idx_user_role_history_user_id on public.user_role_history(user_id);
create index idx_user_role_history_old_role_id on public.user_role_history(old_role_id);
create index idx_user_role_history_new_role_id on public.user_role_history(new_role_id);
create index idx_role_policies_role_id on public.role_policies(role_id);
create index idx_role_policies_resource_action on public.role_policies(resource_type, action);
create index idx_role_policies_priority on public.role_policies(priority);
create index idx_session_policies_role_id on public.session_policies(role_id);

-- 更新日時自動更新トリガー設定
create trigger update_otp_challenges_updated_at
  before update on public.otp_challenges
  for each row execute function public.update_updated_at_column();

create trigger update_role_policies_updated_at
  before update on public.role_policies
  for each row execute function public.update_updated_at_column();

create trigger update_session_policies_updated_at
  before update on public.session_policies
  for each row execute function public.update_updated_at_column();

-- RLSの有効化
alter table public.otp_challenges enable row level security;
alter table public.user_role_history enable row level security;
alter table public.role_policies enable row level security;
alter table public.session_policies enable row level security;

-- RLSポリシーの作成
create policy "OTPチャレンジは本人のみが参照可能"
  on public.otp_challenges for select
  to authenticated
  using (auth.uid() = user_id);

create policy "OTPチャレンジは本人のみが管理可能"
  on public.otp_challenges for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ロール履歴は管理者のみが参照可能"
  on public.user_role_history for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "ロール履歴は管理者のみが作成可能"
  on public.user_role_history for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "ロールポリシーは管理者のみが参照可能"
  on public.role_policies for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "ロールポリシーは管理者のみが管理可能"
  on public.role_policies for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "セッションポリシーは管理者のみが参照可能"
  on public.session_policies for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );

create policy "セッションポリシーは管理者のみが管理可能"
  on public.session_policies for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      inner join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'admin'
    )
  );
