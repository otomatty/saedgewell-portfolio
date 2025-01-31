-- お問い合わせを管理するテーブル
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('company', 'general', 'estimate')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ブログ記事を管理するテーブル
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estimated_reading_time INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- ブログ記事のカテゴリーを管理するテーブル
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ブログ記事とカテゴリーの中間テーブル
CREATE TABLE blog_posts_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- 見積もり依頼を管理するテーブル
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  project_type TEXT NOT NULL CHECK (project_type IN ('web', 'app', 'other')),
  description TEXT NOT NULL,
  deadline TEXT NOT NULL CHECK (deadline IN ('asap', '1month', '3months', '6months', 'flexible')),
  base_cost INTEGER NOT NULL,
  rush_fee INTEGER NOT NULL DEFAULT 0,
  total_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 見積もりの機能を管理するテーブル
CREATE TABLE estimate_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration DECIMAL NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('core', 'user', 'auth', 'content', 'payment', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 見積もりの実装要件を管理するテーブル
CREATE TABLE estimate_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  has_design BOOLEAN NOT NULL DEFAULT false,
  design_format TEXT CHECK (design_format IN ('figma', 'xd', 'photoshop', 'sketch', 'other')),
  has_brand_guidelines BOOLEAN NOT NULL DEFAULT false,
  has_logo BOOLEAN NOT NULL DEFAULT false,
  has_images BOOLEAN NOT NULL DEFAULT false,
  has_icons BOOLEAN NOT NULL DEFAULT false,
  has_custom_fonts BOOLEAN NOT NULL DEFAULT false,
  has_content BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックスの作成
CREATE INDEX contacts_email_idx ON contacts (email);
CREATE INDEX contacts_type_status_idx ON contacts (type, status);
CREATE INDEX contacts_created_at_idx ON contacts (created_at);

CREATE INDEX blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX blog_posts_published_at_idx ON blog_posts (published_at);
CREATE INDEX blog_posts_status_published_at_idx ON blog_posts (status, published_at);

CREATE INDEX blog_categories_name_idx ON blog_categories (name);

CREATE INDEX blog_posts_categories_category_id_idx ON blog_posts_categories (category_id);
CREATE INDEX blog_posts_categories_post_id_idx ON blog_posts_categories (post_id);

CREATE INDEX estimates_contact_id_idx ON estimates (contact_id);
CREATE INDEX estimates_project_type_status_idx ON estimates (project_type, status);
CREATE INDEX estimates_created_at_idx ON estimates (created_at);

CREATE INDEX estimate_features_estimate_id_idx ON estimate_features (estimate_id);
CREATE INDEX estimate_features_category_idx ON estimate_features (category);
CREATE INDEX estimate_features_is_required_idx ON estimate_features (is_required);

CREATE INDEX estimate_requirements_estimate_id_idx ON estimate_requirements (estimate_id);

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION set_published_at_on_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost = NEW.base_cost + NEW.rush_fee;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_estimate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE estimates
    SET base_cost = (
      SELECT COALESCE(SUM(price), 0)
      FROM estimate_features
      WHERE estimate_id = OLD.estimate_id
    )
    WHERE id = OLD.estimate_id;
  ELSE
    UPDATE estimates
    SET base_cost = (
      SELECT COALESCE(SUM(price), 0)
      FROM estimate_features
      WHERE estimate_id = NEW.estimate_id
    )
    WHERE id = NEW.estimate_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_published_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at_on_publish();

CREATE TRIGGER update_estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calculate_total_cost
  BEFORE INSERT OR UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_cost();

CREATE TRIGGER update_estimate_total_cost
  AFTER INSERT OR UPDATE OR DELETE ON estimate_features
  FOR EACH ROW
  EXECUTE FUNCTION update_estimate_total_cost();

CREATE TRIGGER update_estimate_requirements_updated_at
  BEFORE UPDATE ON estimate_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシーの設定
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_requirements ENABLE ROW LEVEL SECURITY;

-- 誰でもお問い合わせを作成可能
CREATE POLICY "誰でもお問い合わせを作成可能" ON contacts
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- 管理者のみお問い合わせの閲覧・編集・削除が可能
CREATE POLICY "管理者のみお問い合わせの閲覧・編集・削除が可能" ON contacts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 公開済みの記事は誰でも閲覧可能
CREATE POLICY "公開済みの記事は誰でも閲覧可能" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- 管理者のみ記事の作成・編集・削除が可能
CREATE POLICY "管理者のみ記事の作成・編集・削除が可能" ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- カテゴリーは誰でも閲覧可能
CREATE POLICY "カテゴリーは誰でも閲覧可能" ON blog_categories
  FOR SELECT
  TO PUBLIC;

-- 管理者のみカテゴリーの作成・編集・削除が可能
CREATE POLICY "管理者のみカテゴリーの作成・編集・削除が可能" ON blog_categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 公開済みの記事に紐づくカテゴリーは誰でも閲覧可能
CREATE POLICY "公開済みの記事に紐づくカテゴリーは誰でも閲覧可能" ON blog_posts_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = post_id
      AND blog_posts.status = 'published'
    )
  );

-- 管理者のみ記事とカテゴリーの紐付けの作成・削除が可能
CREATE POLICY "管理者のみ記事とカテゴリーの紐付けの作成・削除が可能" ON blog_posts_categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 誰でも見積もりを作成可能
CREATE POLICY "誰でも見積もりを作成可能" ON estimates
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- 管理者のみ見積もりの閲覧・編集・削除が可能
CREATE POLICY "管理者のみ見積もりの閲覧・編集・削除が可能" ON estimates
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 管理者のみ機能の作成・編集・削除が可能
CREATE POLICY "管理者のみ機能の作成・編集・削除が可能" ON estimate_features
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 見積もりに紐づく機能は誰でも閲覧可能
CREATE POLICY "見積もりに紐づく機能は誰でも閲覧可能" ON estimate_features
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM estimates
      WHERE estimates.id = estimate_id
    )
  );

-- 管理者のみ実装要件の作成・編集・削除が可能
CREATE POLICY "管理者のみ実装要件の作成・編集・削除が可能" ON estimate_requirements
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 見積もりに紐づく実装要件は誰でも閲覧可能
CREATE POLICY "見積もりに紐づく実装要件は誰でも閲覧可能" ON estimate_requirements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM estimates
      WHERE estimates.id = estimate_id
    )
  );
