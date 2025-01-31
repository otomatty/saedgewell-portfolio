-- 実績の基本情報を管理するテーブル
CREATE TABLE works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('company', 'freelance', 'personal')),
  github_url TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の詳細情報を管理するテーブル
CREATE TABLE work_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  overview TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  team_size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の画像を管理するテーブル
CREATE TABLE work_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の担当業務を管理するテーブル
CREATE TABLE work_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の課題を管理するテーブル
CREATE TABLE work_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の解決策を管理するテーブル
CREATE TABLE work_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES work_challenges(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績の成果を管理するテーブル
CREATE TABLE work_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 技術スタックを管理するテーブル
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'infrastructure', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 実績と技術スタックの中間テーブル
CREATE TABLE work_technologies (
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (work_id, technology_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックスの作成
CREATE INDEX works_slug_idx ON works (slug);
CREATE INDEX works_category_idx ON works (category);
CREATE INDEX works_status_created_at_idx ON works (status, created_at);
CREATE INDEX work_details_work_id_idx ON work_details (work_id);
CREATE INDEX work_images_work_id_sort_order_idx ON work_images (work_id, sort_order);
CREATE INDEX work_responsibilities_work_id_sort_order_idx ON work_responsibilities (work_id, sort_order);
CREATE INDEX work_challenges_work_id_sort_order_idx ON work_challenges (work_id, sort_order);
CREATE INDEX work_solutions_work_id_sort_order_idx ON work_solutions (work_id, sort_order);
CREATE INDEX work_solutions_challenge_id_idx ON work_solutions (challenge_id);
CREATE INDEX work_results_work_id_sort_order_idx ON work_results (work_id, sort_order);
CREATE INDEX technologies_name_idx ON technologies (name);
CREATE INDEX technologies_category_idx ON technologies (category);
CREATE INDEX work_technologies_technology_id_idx ON work_technologies (technology_id);
CREATE INDEX work_technologies_work_id_idx ON work_technologies (work_id);

-- 更新日時更新用の関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER update_works_updated_at
  BEFORE UPDATE ON works
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_details_updated_at
  BEFORE UPDATE ON work_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_images_updated_at
  BEFORE UPDATE ON work_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_responsibilities_updated_at
  BEFORE UPDATE ON work_responsibilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_challenges_updated_at
  BEFORE UPDATE ON work_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_solutions_updated_at
  BEFORE UPDATE ON work_solutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_results_updated_at
  BEFORE UPDATE ON work_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at
  BEFORE UPDATE ON technologies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシーの設定
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_technologies ENABLE ROW LEVEL SECURITY;

-- 公開済みの実績は誰でも閲覧可能
CREATE POLICY "公開済みの実績は誰でも閲覧可能" ON works
  FOR SELECT
  USING (status = 'published');

-- 公開済みの実績の詳細は誰でも閲覧可能
CREATE POLICY "公開済みの実績の詳細は誰でも閲覧可能" ON work_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 公開済みの実績の画像は誰でも閲覧可能
CREATE POLICY "公開済みの実績の画像は誰でも閲覧可能" ON work_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 公開済みの実績の担当業務は誰でも閲覧可能
CREATE POLICY "公開済みの実績の担当業務は誰でも閲覧可能" ON work_responsibilities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 公開済みの実績の課題は誰でも閲覧可能
CREATE POLICY "公開済みの実績の課題は誰でも閲覧可能" ON work_challenges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 公開済みの実績の解決策は誰でも閲覧可能
CREATE POLICY "公開済みの実績の解決策は誰でも閲覧可能" ON work_solutions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 公開済みの実績の成果は誰でも閲覧可能
CREATE POLICY "公開済みの実績の成果は誰でも閲覧可能" ON work_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 技術スタックは誰でも閲覧可能
CREATE POLICY "技術スタックは誰でも閲覧可能" ON technologies
  FOR SELECT
  TO PUBLIC;

-- 公開済みの実績に紐づく技術は誰でも閲覧可能
CREATE POLICY "公開済みの実績に紐づく技術は誰でも閲覧可能" ON work_technologies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_id
      AND works.status = 'published'
    )
  );

-- 管理者のみ各テーブルの作成・編集・削除が可能
CREATE POLICY "管理者のみ実績の作成・編集・削除が可能" ON works
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ詳細情報の作成・編集・削除が可能" ON work_details
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ画像の作成・編集・削除が可能" ON work_images
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ担当業務の作成・編集・削除が可能" ON work_responsibilities
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ課題の作成・編集・削除が可能" ON work_challenges
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ解決策の作成・編集・削除が可能" ON work_solutions
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ成果の作成・編集・削除が可能" ON work_results
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ技術スタックの作成・編集・削除が可能" ON technologies
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "管理者のみ実績と技術の紐付けの作成・削除が可能" ON work_technologies
  FOR ALL
  USING (auth.role() = 'authenticated');
