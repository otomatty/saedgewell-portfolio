-- 管理者ロールのセッションポリシー設定
insert into public.session_policies (
  role_id,
  max_sessions,
  session_timeout,
  require_otp,
  time_restriction
)
select
  r.id,
  5, -- 最大5セッション
  interval '12 hours', -- 12時間でタイムアウト
  true, -- OTP必須
  '{"weekday": {"start": "00:00", "end": "23:59"}, "weekend": {"start": "00:00", "end": "23:59"}}' -- 24時間アクセス可能
from public.roles r
where r.name = 'admin';

-- クライアントロールのセッションポリシー設定
insert into public.session_policies (
  role_id,
  max_sessions,
  session_timeout,
  require_otp,
  time_restriction
)
select
  r.id,
  3, -- 最大3セッション
  interval '8 hours', -- 8時間でタイムアウト
  true, -- OTP必須
  '{"weekday": {"start": "09:00", "end": "18:00"}, "weekend": {"start": "10:00", "end": "17:00"}}' -- 営業時間内のみアクセス可能
from public.roles r
where r.name = 'client';

-- 一般ユーザーロールのセッションポリシー設定
insert into public.session_policies (
  role_id,
  max_sessions,
  session_timeout,
  require_otp,
  time_restriction
)
select
  r.id,
  2, -- 最大2セッション
  interval '24 hours', -- 24時間でタイムアウト
  false, -- OTP任意
  '{"weekday": {"start": "00:00", "end": "23:59"}, "weekend": {"start": "00:00", "end": "23:59"}}' -- 24時間アクセス可能
from public.roles r
where r.name = 'user';

-- 管理者ロールのアクセスポリシー設定
insert into public.role_policies (
  role_id,
  resource_type,
  action,
  effect,
  priority,
  conditions
)
select
  r.id,
  resource_type,
  action,
  'allow',
  100,
  conditions
from public.roles r
cross join (
  values
    ('users', 'manage', '{"require_otp": true}'::jsonb),
    ('roles', 'manage', '{"require_otp": true}'::jsonb),
    ('content', 'manage', '{"require_otp": false}'::jsonb),
    ('settings', 'manage', '{"require_otp": true}'::jsonb)
) as policies(resource_type, action, conditions)
where r.name = 'admin';

-- クライアントロールのアクセスポリシー設定
insert into public.role_policies (
  role_id,
  resource_type,
  action,
  effect,
  priority,
  conditions
)
select
  r.id,
  resource_type,
  action,
  'allow',
  50,
  conditions
from public.roles r
cross join (
  values
    ('projects', 'manage', '{"owner_only": true}'::jsonb),
    ('members', 'manage', '{"project_members_only": true}'::jsonb),
    ('content', 'read', '{"public_only": true}'::jsonb)
) as policies(resource_type, action, conditions)
where r.name = 'client';

-- 一般ユーザーロールのアクセスポリシー設定
insert into public.role_policies (
  role_id,
  resource_type,
  action,
  effect,
  priority,
  conditions
)
select
  r.id,
  resource_type,
  action,
  'allow',
  10,
  conditions
from public.roles r
cross join (
  values
    ('profile', 'manage', '{"self_only": true}'::jsonb),
    ('content', 'read', '{"public_only": true}'::jsonb),
    ('comments', 'create', '{"authenticated": true}'::jsonb)
) as policies(resource_type, action, conditions)
where r.name = 'user';
