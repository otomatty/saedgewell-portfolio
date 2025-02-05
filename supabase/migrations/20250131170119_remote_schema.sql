

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_total_cost"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.total_cost = NEW.base_cost + NEW.rush_fee;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calculate_total_cost"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_published_at_on_publish"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_published_at_on_publish"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_estimate_total_cost"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."update_estimate_total_cost"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "thumbnail_url" "text",
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "estimated_reading_time" integer NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    CONSTRAINT "blog_posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts_categories" (
    "post_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."blog_posts_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "company_name" "text",
    "phone" "text",
    "message" "text" NOT NULL,
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "contacts_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'in_progress'::"text", 'completed'::"text", 'archived'::"text"]))),
    CONSTRAINT "contacts_type_check" CHECK (("type" = ANY (ARRAY['company'::"text", 'general'::"text", 'estimate'::"text"])))
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estimate_features" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "estimate_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "price" integer NOT NULL,
    "duration" numeric NOT NULL,
    "is_required" boolean DEFAULT false NOT NULL,
    "category" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "estimate_features_category_check" CHECK (("category" = ANY (ARRAY['core'::"text", 'user'::"text", 'auth'::"text", 'content'::"text", 'payment'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."estimate_features" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estimate_requirements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "estimate_id" "uuid",
    "has_design" boolean DEFAULT false NOT NULL,
    "design_format" "text",
    "has_brand_guidelines" boolean DEFAULT false NOT NULL,
    "has_logo" boolean DEFAULT false NOT NULL,
    "has_images" boolean DEFAULT false NOT NULL,
    "has_icons" boolean DEFAULT false NOT NULL,
    "has_custom_fonts" boolean DEFAULT false NOT NULL,
    "has_content" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "estimate_requirements_design_format_check" CHECK (("design_format" = ANY (ARRAY['figma'::"text", 'xd'::"text", 'photoshop'::"text", 'sketch'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."estimate_requirements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estimates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contact_id" "uuid",
    "project_type" "text" NOT NULL,
    "description" "text" NOT NULL,
    "deadline" "text" NOT NULL,
    "base_cost" integer NOT NULL,
    "rush_fee" integer DEFAULT 0 NOT NULL,
    "total_cost" integer NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "estimates_deadline_check" CHECK (("deadline" = ANY (ARRAY['asap'::"text", '1month'::"text", '3months'::"text", '6months'::"text", 'flexible'::"text"]))),
    CONSTRAINT "estimates_project_type_check" CHECK (("project_type" = ANY (ARRAY['web'::"text", 'app'::"text", 'other'::"text"]))),
    CONSTRAINT "estimates_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'sent'::"text", 'accepted'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."estimates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."technologies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "technologies_category_check" CHECK (("category" = ANY (ARRAY['frontend'::"text", 'backend'::"text", 'database'::"text", 'infrastructure'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."technologies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_challenges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_challenges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "overview" "text" NOT NULL,
    "role" "text" NOT NULL,
    "period" "text" NOT NULL,
    "team_size" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "alt" "text" NOT NULL,
    "caption" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_responsibilities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_responsibilities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_solutions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "work_id" "uuid" NOT NULL,
    "challenge_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_solutions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_technologies" (
    "work_id" "uuid" NOT NULL,
    "technology_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_technologies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."works" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "thumbnail_url" "text" NOT NULL,
    "category" "text" NOT NULL,
    "github_url" "text",
    "website_url" "text",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "works_category_check" CHECK (("category" = ANY (ARRAY['company'::"text", 'freelance'::"text", 'personal'::"text"]))),
    CONSTRAINT "works_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."works" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts_categories"
    ADD CONSTRAINT "blog_posts_categories_pkey" PRIMARY KEY ("post_id", "category_id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."estimate_features"
    ADD CONSTRAINT "estimate_features_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."estimate_requirements"
    ADD CONSTRAINT "estimate_requirements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."technologies"
    ADD CONSTRAINT "technologies_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."technologies"
    ADD CONSTRAINT "technologies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_challenges"
    ADD CONSTRAINT "work_challenges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_details"
    ADD CONSTRAINT "work_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_images"
    ADD CONSTRAINT "work_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_responsibilities"
    ADD CONSTRAINT "work_responsibilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_results"
    ADD CONSTRAINT "work_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_solutions"
    ADD CONSTRAINT "work_solutions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_technologies"
    ADD CONSTRAINT "work_technologies_pkey" PRIMARY KEY ("work_id", "technology_id");



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_slug_key" UNIQUE ("slug");



CREATE INDEX "blog_categories_name_idx" ON "public"."blog_categories" USING "btree" ("name");



CREATE INDEX "blog_posts_categories_category_id_idx" ON "public"."blog_posts_categories" USING "btree" ("category_id");



CREATE INDEX "blog_posts_categories_post_id_idx" ON "public"."blog_posts_categories" USING "btree" ("post_id");



CREATE INDEX "blog_posts_published_at_idx" ON "public"."blog_posts" USING "btree" ("published_at");



CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts" USING "btree" ("slug");



CREATE INDEX "blog_posts_status_published_at_idx" ON "public"."blog_posts" USING "btree" ("status", "published_at");



CREATE INDEX "contacts_created_at_idx" ON "public"."contacts" USING "btree" ("created_at");



CREATE INDEX "contacts_email_idx" ON "public"."contacts" USING "btree" ("email");



CREATE INDEX "contacts_type_status_idx" ON "public"."contacts" USING "btree" ("type", "status");



CREATE INDEX "estimate_features_category_idx" ON "public"."estimate_features" USING "btree" ("category");



CREATE INDEX "estimate_features_estimate_id_idx" ON "public"."estimate_features" USING "btree" ("estimate_id");



CREATE INDEX "estimate_features_is_required_idx" ON "public"."estimate_features" USING "btree" ("is_required");



CREATE INDEX "estimate_requirements_estimate_id_idx" ON "public"."estimate_requirements" USING "btree" ("estimate_id");



CREATE INDEX "estimates_contact_id_idx" ON "public"."estimates" USING "btree" ("contact_id");



CREATE INDEX "estimates_created_at_idx" ON "public"."estimates" USING "btree" ("created_at");



CREATE INDEX "estimates_project_type_status_idx" ON "public"."estimates" USING "btree" ("project_type", "status");



CREATE INDEX "technologies_category_idx" ON "public"."technologies" USING "btree" ("category");



CREATE INDEX "technologies_name_idx" ON "public"."technologies" USING "btree" ("name");



CREATE INDEX "work_challenges_work_id_sort_order_idx" ON "public"."work_challenges" USING "btree" ("work_id", "sort_order");



CREATE INDEX "work_details_work_id_idx" ON "public"."work_details" USING "btree" ("work_id");



CREATE INDEX "work_images_work_id_sort_order_idx" ON "public"."work_images" USING "btree" ("work_id", "sort_order");



CREATE INDEX "work_responsibilities_work_id_sort_order_idx" ON "public"."work_responsibilities" USING "btree" ("work_id", "sort_order");



CREATE INDEX "work_results_work_id_sort_order_idx" ON "public"."work_results" USING "btree" ("work_id", "sort_order");



CREATE INDEX "work_solutions_challenge_id_idx" ON "public"."work_solutions" USING "btree" ("challenge_id");



CREATE INDEX "work_solutions_work_id_sort_order_idx" ON "public"."work_solutions" USING "btree" ("work_id", "sort_order");



CREATE INDEX "work_technologies_technology_id_idx" ON "public"."work_technologies" USING "btree" ("technology_id");



CREATE INDEX "work_technologies_work_id_idx" ON "public"."work_technologies" USING "btree" ("work_id");



CREATE INDEX "works_category_idx" ON "public"."works" USING "btree" ("category");



CREATE INDEX "works_slug_idx" ON "public"."works" USING "btree" ("slug");



CREATE INDEX "works_status_created_at_idx" ON "public"."works" USING "btree" ("status", "created_at");



CREATE OR REPLACE TRIGGER "calculate_total_cost" BEFORE INSERT OR UPDATE ON "public"."estimates" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_total_cost"();



CREATE OR REPLACE TRIGGER "set_published_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_published_at_on_publish"();



CREATE OR REPLACE TRIGGER "update_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contacts_updated_at" BEFORE UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_estimate_requirements_updated_at" BEFORE UPDATE ON "public"."estimate_requirements" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_estimate_total_cost" AFTER INSERT OR DELETE OR UPDATE ON "public"."estimate_features" FOR EACH ROW EXECUTE FUNCTION "public"."update_estimate_total_cost"();



CREATE OR REPLACE TRIGGER "update_estimates_updated_at" BEFORE UPDATE ON "public"."estimates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_technologies_updated_at" BEFORE UPDATE ON "public"."technologies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_challenges_updated_at" BEFORE UPDATE ON "public"."work_challenges" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_details_updated_at" BEFORE UPDATE ON "public"."work_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_images_updated_at" BEFORE UPDATE ON "public"."work_images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_responsibilities_updated_at" BEFORE UPDATE ON "public"."work_responsibilities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_results_updated_at" BEFORE UPDATE ON "public"."work_results" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_solutions_updated_at" BEFORE UPDATE ON "public"."work_solutions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_works_updated_at" BEFORE UPDATE ON "public"."works" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."blog_posts_categories"
    ADD CONSTRAINT "blog_posts_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_posts_categories"
    ADD CONSTRAINT "blog_posts_categories_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estimate_features"
    ADD CONSTRAINT "estimate_features_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estimate_requirements"
    ADD CONSTRAINT "estimate_requirements_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id");



ALTER TABLE ONLY "public"."work_challenges"
    ADD CONSTRAINT "work_challenges_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_details"
    ADD CONSTRAINT "work_details_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_images"
    ADD CONSTRAINT "work_images_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_responsibilities"
    ADD CONSTRAINT "work_responsibilities_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_results"
    ADD CONSTRAINT "work_results_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_solutions"
    ADD CONSTRAINT "work_solutions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."work_challenges"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."work_solutions"
    ADD CONSTRAINT "work_solutions_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_technologies"
    ADD CONSTRAINT "work_technologies_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_technologies"
    ADD CONSTRAINT "work_technologies_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE CASCADE;



ALTER TABLE "public"."blog_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estimate_features" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estimate_requirements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estimates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."technologies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_challenges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_responsibilities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_solutions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_technologies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."works" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "カテゴリーは誰でも閲覧可能" ON "public"."blog_categories" FOR SELECT;



CREATE POLICY "公開済みの実績に紐づく技術は誰でも閲覧可能" ON "public"."work_technologies" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_technologies"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の成果は誰でも閲覧可能" ON "public"."work_results" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_results"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の担当業務は誰でも閲覧可能" ON "public"."work_responsibilities" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_responsibilities"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の画像は誰でも閲覧可能" ON "public"."work_images" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_images"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の解決策は誰でも閲覧可能" ON "public"."work_solutions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_solutions"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の詳細は誰でも閲覧可能" ON "public"."work_details" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_details"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績の課題は誰でも閲覧可能" ON "public"."work_challenges" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."works"
  WHERE (("works"."id" = "work_challenges"."work_id") AND ("works"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの実績は誰でも閲覧可能" ON "public"."works" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "公開済みの記事に紐づくカテゴリーは誰でも閲" ON "public"."blog_posts_categories" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."blog_posts"
  WHERE (("blog_posts"."id" = "blog_posts_categories"."post_id") AND ("blog_posts"."status" = 'published'::"text")))));



CREATE POLICY "公開済みの記事は誰でも閲覧可能" ON "public"."blog_posts" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "技術スタックは誰でも閲覧可能" ON "public"."technologies" FOR SELECT;



CREATE POLICY "管理者のみお問い合わせの閲覧・編集・削除が" ON "public"."contacts" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみカテゴリーの作成・編集・削除が可" ON "public"."blog_categories" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ実績と技術の紐付けの作成・削除が" ON "public"."work_technologies" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ実績の作成・編集・削除が可能" ON "public"."works" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ実装要件の作成・編集・削除が可能" ON "public"."estimate_requirements" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ成果の作成・編集・削除が可能" ON "public"."work_results" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ技術スタックの作成・編集・削除が" ON "public"."technologies" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ担当業務の作成・編集・削除が可能" ON "public"."work_responsibilities" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ機能の作成・編集・削除が可能" ON "public"."estimate_features" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ画像の作成・編集・削除が可能" ON "public"."work_images" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ見積もりの閲覧・編集・削除が可能" ON "public"."estimates" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ解決策の作成・編集・削除が可能" ON "public"."work_solutions" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ記事とカテゴリーの紐付けの作成・" ON "public"."blog_posts_categories" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ記事の作成・編集・削除が可能" ON "public"."blog_posts" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ詳細情報の作成・編集・削除が可能" ON "public"."work_details" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "管理者のみ課題の作成・編集・削除が可能" ON "public"."work_challenges" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "見積もりに紐づく実装要件は誰でも閲覧可能" ON "public"."estimate_requirements" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."estimates"
  WHERE ("estimates"."id" = "estimate_requirements"."estimate_id"))));



CREATE POLICY "見積もりに紐づく機能は誰でも閲覧可能" ON "public"."estimate_features" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."estimates"
  WHERE ("estimates"."id" = "estimate_features"."estimate_id"))));



CREATE POLICY "誰でもお問い合わせを作成可能" ON "public"."contacts" FOR INSERT WITH CHECK (true);



CREATE POLICY "誰でも見積もりを作成可能" ON "public"."estimates" FOR INSERT WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."calculate_total_cost"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_total_cost"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_total_cost"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_published_at_on_publish"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_published_at_on_publish"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_published_at_on_publish"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_estimate_total_cost"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_estimate_total_cost"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_estimate_total_cost"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."blog_categories" TO "anon";
GRANT ALL ON TABLE "public"."blog_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_categories" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts_categories" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts_categories" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."estimate_features" TO "anon";
GRANT ALL ON TABLE "public"."estimate_features" TO "authenticated";
GRANT ALL ON TABLE "public"."estimate_features" TO "service_role";



GRANT ALL ON TABLE "public"."estimate_requirements" TO "anon";
GRANT ALL ON TABLE "public"."estimate_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."estimate_requirements" TO "service_role";



GRANT ALL ON TABLE "public"."estimates" TO "anon";
GRANT ALL ON TABLE "public"."estimates" TO "authenticated";
GRANT ALL ON TABLE "public"."estimates" TO "service_role";



GRANT ALL ON TABLE "public"."technologies" TO "anon";
GRANT ALL ON TABLE "public"."technologies" TO "authenticated";
GRANT ALL ON TABLE "public"."technologies" TO "service_role";



GRANT ALL ON TABLE "public"."work_challenges" TO "anon";
GRANT ALL ON TABLE "public"."work_challenges" TO "authenticated";
GRANT ALL ON TABLE "public"."work_challenges" TO "service_role";



GRANT ALL ON TABLE "public"."work_details" TO "anon";
GRANT ALL ON TABLE "public"."work_details" TO "authenticated";
GRANT ALL ON TABLE "public"."work_details" TO "service_role";



GRANT ALL ON TABLE "public"."work_images" TO "anon";
GRANT ALL ON TABLE "public"."work_images" TO "authenticated";
GRANT ALL ON TABLE "public"."work_images" TO "service_role";



GRANT ALL ON TABLE "public"."work_responsibilities" TO "anon";
GRANT ALL ON TABLE "public"."work_responsibilities" TO "authenticated";
GRANT ALL ON TABLE "public"."work_responsibilities" TO "service_role";



GRANT ALL ON TABLE "public"."work_results" TO "anon";
GRANT ALL ON TABLE "public"."work_results" TO "authenticated";
GRANT ALL ON TABLE "public"."work_results" TO "service_role";



GRANT ALL ON TABLE "public"."work_solutions" TO "anon";
GRANT ALL ON TABLE "public"."work_solutions" TO "authenticated";
GRANT ALL ON TABLE "public"."work_solutions" TO "service_role";



GRANT ALL ON TABLE "public"."work_technologies" TO "anon";
GRANT ALL ON TABLE "public"."work_technologies" TO "authenticated";
GRANT ALL ON TABLE "public"."work_technologies" TO "service_role";



GRANT ALL ON TABLE "public"."works" TO "anon";
GRANT ALL ON TABLE "public"."works" TO "authenticated";
GRANT ALL ON TABLE "public"."works" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
