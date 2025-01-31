-- 技術スタックのシードデータ
INSERT INTO technologies (id, name, category) VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'Next.js', 'frontend'),
  ('123e4567-e89b-12d3-a456-426614174001', 'TypeScript', 'frontend'),
  ('123e4567-e89b-12d3-a456-426614174002', 'Tailwind CSS', 'frontend'),
  ('123e4567-e89b-12d3-a456-426614174003', 'shadcn/ui', 'frontend'),
  ('123e4567-e89b-12d3-a456-426614174004', 'Jotai', 'frontend'),
  ('123e4567-e89b-12d3-a456-426614174005', 'Supabase', 'backend'),
  ('123e4567-e89b-12d3-a456-426614174006', 'PostgreSQL', 'database'),
  ('123e4567-e89b-12d3-a456-426614174007', 'Cloudflare Pages', 'infrastructure'),
  ('123e4567-e89b-12d3-a456-426614174008', 'Bun', 'other');

-- ブログカテゴリーのシードデータ
INSERT INTO blog_categories (id, name) VALUES
  ('223e4567-e89b-12d3-a456-426614174000', 'フロントエンド'),
  ('223e4567-e89b-12d3-a456-426614174001', 'バックエンド'),
  ('223e4567-e89b-12d3-a456-426614174002', 'インフラ'),
  ('223e4567-e89b-12d3-a456-426614174003', 'デザイン'),
  ('223e4567-e89b-12d3-a456-426614174004', '開発プロセス');

-- 実績のシードデータ
INSERT INTO works (id, slug, title, description, thumbnail_url, category, github_url, website_url, status) VALUES
  (
    '323e4567-e89b-12d3-a456-426614174000',
    'portfolio-site',
    'ポートフォリオサイト',
    '自身のポートフォリオサイトを Next.js と Supabase を使用して開発しました。',
    'https://example.com/images/portfolio.jpg',
    'personal',
    'https://github.com/yourusername/portfolio',
    'https://your-portfolio.com',
    'published'
  );

-- 実績の詳細情報のシードデータ
INSERT INTO work_details (id, work_id, overview, role, period, team_size) VALUES
  (
    '423e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'Next.js、TypeScript、Tailwind CSS、Supabaseを使用して、モダンでパフォーマンスの高いポートフォリオサイトを開発しました。',
    'フルスタック開発者',
    '2024年1月 - 2024年2月',
    '1人'
  );

-- 実績の画像のシードデータ
INSERT INTO work_images (id, work_id, url, alt, caption, sort_order) VALUES
  (
    '523e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'https://example.com/images/portfolio-top.jpg',
    'ポートフォリオサイトのトップページ',
    'モダンでミニマルなデザインのトップページ',
    0
  ),
  (
    '523e4567-e89b-12d3-a456-426614174001',
    '323e4567-e89b-12d3-a456-426614174000',
    'https://example.com/images/portfolio-works.jpg',
    'ポートフォリオサイトの実績一覧ページ',
    'グリッドレイアウトの実績一覧ページ',
    1
  );

-- 実績の担当業務のシードデータ
INSERT INTO work_responsibilities (id, work_id, description, sort_order) VALUES
  (
    '623e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'プロジェクトの要件定義と設計',
    0
  ),
  (
    '623e4567-e89b-12d3-a456-426614174001',
    '323e4567-e89b-12d3-a456-426614174000',
    'フロントエンドの実装（Next.js, TypeScript, Tailwind CSS）',
    1
  ),
  (
    '623e4567-e89b-12d3-a456-426614174002',
    '323e4567-e89b-12d3-a456-426614174000',
    'バックエンドの実装（Supabase）',
    2
  );

-- 実績の課題のシードデータ
INSERT INTO work_challenges (id, work_id, title, description, sort_order) VALUES
  (
    '723e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'パフォーマンスの最適化',
    'ページの読み込み速度とパフォーマンスの最適化が必要でした。',
    0
  );

-- 実績の解決策のシードデータ
INSERT INTO work_solutions (id, work_id, challenge_id, title, description, sort_order) VALUES
  (
    '823e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    '723e4567-e89b-12d3-a456-426614174000',
    'Next.jsの最適化機能の活用',
    'Image ComponentやApp Routerの機能を活用し、画像の最適化とルーティングの効率化を実現しました。',
    0
  );

-- 実績の成果のシードデータ
INSERT INTO work_results (id, work_id, description, sort_order) VALUES
  (
    '923e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'Lighthouseスコアで90以上を達成',
    0
  ),
  (
    '923e4567-e89b-12d3-a456-426614174001',
    '323e4567-e89b-12d3-a456-426614174000',
    'ページの読み込み時間を2秒以下に改善',
    1
  );

-- 実績と技術スタックの紐付けデータ
INSERT INTO work_technologies (work_id, technology_id) VALUES
  ('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000'),
  ('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'),
  ('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002'),
  ('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174005');

-- ブログ記事のシードデータ
INSERT INTO blog_posts (id, slug, title, description, content, thumbnail_url, estimated_reading_time, status) VALUES
  (
    'a23e4567-e89b-12d3-a456-426614174000',
    'getting-started-with-nextjs',
    'Next.jsで始めるモダンなWeb開発',
    'Next.jsの基本的な機能と使い方について解説します。',
    '# Next.jsで始めるモダンなWeb開発\n\nNext.jsは、Reactベースのフルスタックフレームワークです...',
    'https://example.com/images/nextjs-blog.jpg',
    5,
    'published'
  );

-- ブログ記事とカテゴリーの紐付けデータ
INSERT INTO blog_posts_categories (post_id, category_id) VALUES
  ('a23e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000');

-- お問い合わせのシードデータ
INSERT INTO contacts (id, type, name, email, company_name, phone, message, status) VALUES
  (
    'b23e4567-e89b-12d3-a456-426614174000',
    'company',
    '山田太郎',
    'yamada@example.com',
    '株式会社サンプル',
    '03-1234-5678',
    'Webアプリケーション開発の見積もりについて相談させていただきたいです。',
    'new'
  );

-- 見積もりのシードデータ
INSERT INTO estimates (id, contact_id, project_type, description, deadline, base_cost, rush_fee, total_cost, status) VALUES
  (
    'c23e4567-e89b-12d3-a456-426614174000',
    'b23e4567-e89b-12d3-a456-426614174000',
    'web',
    '企業のコーポレートサイトの開発',
    '3months',
    1000000,
    0,
    1000000,
    'draft'
  );

-- 見積もりの機能のシードデータ
INSERT INTO estimate_features (id, estimate_id, name, description, price, duration, is_required, category) VALUES
  (
    'd23e4567-e89b-12d3-a456-426614174000',
    'c23e4567-e89b-12d3-a456-426614174000',
    'レスポンシブデザイン',
    'スマートフォンやタブレットに対応したレスポンシブデザインの実装',
    200000,
    5,
    true,
    'core'
  );

-- 見積もりの実装要件のシードデータ
INSERT INTO estimate_requirements (id, estimate_id, has_design, design_format, has_brand_guidelines, has_logo, has_images, has_icons, has_custom_fonts, has_content) VALUES
  (
    'e23e4567-e89b-12d3-a456-426614174000',
    'c23e4567-e89b-12d3-a456-426614174000',
    true,
    'figma',
    true,
    true,
    true,
    true,
    false,
    false
  );
