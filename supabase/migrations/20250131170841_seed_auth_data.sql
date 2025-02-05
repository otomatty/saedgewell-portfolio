-- 初期ロールの作成
insert into public.roles (name, description) values
  ('admin', '管理者権限'),
  ('client', 'クライアント権限'),
  ('user', '一般ユーザー権限');

-- 初期権限の作成
insert into public.permissions (name, description) values
  ('manage_users', 'ユーザー管理'),
  ('manage_roles', 'ロール管理'),
  ('manage_content', 'コンテンツ管理'),
  ('view_admin_dashboard', '管理画面閲覧'),
  ('manage_client_projects', 'クライアントプロジェクト管理'),
  ('view_client_dashboard', 'クライアントダッシュボード閲覧');

-- 管理者ロールに全ての権限を付与
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin';

-- クライアントロールに特定の権限を付与
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'client'
and p.name in ('view_client_dashboard', 'manage_client_projects');
