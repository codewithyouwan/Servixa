-- Migration 002: Blog feature — admin-authored posts, publicly readable.
-- New tables only (no existing table touched), safe to run any time.
--
-- Design notes:
--   * `content_json` is the source of truth (TipTap's structured document,
--     re-loaded into the editor on edit); `content_html` is a rendered
--     cache used for public display, the RSS feed, and full-text search
--     — regenerated server-side whenever content_json changes, never
--     edited directly.
--   * Authorship points at `admins`, not `users` — this is an admin-only
--     feature, there is no concept of a homeowner/provider/brand author.
--   * `blog_post_revisions` snapshots content on every save so an admin
--     can see/revert history — the difference between a real editorial
--     tool and a form that silently overwrites itself.
--   * Search is Postgres full-text (tsvector + GIN index, trigger-
--     maintained) rather than a separate search service — sufficient
--     for a single-author blog, zero extra infrastructure.

BEGIN;

CREATE TYPE blog_post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

CREATE TABLE blog_posts (
    post_id UUID PRIMARY KEY,
    slug VARCHAR(220) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    excerpt VARCHAR(400),
    content_json JSONB NOT NULL,
    content_html TEXT NOT NULL,
    cover_image_url TEXT,
    status blog_post_status NOT NULL DEFAULT 'draft',
    author_admin_id UUID NOT NULL REFERENCES admins(admin_id),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    view_count BIGINT NOT NULL DEFAULT 0,
    reading_time_minutes SMALLINT NOT NULL DEFAULT 1,
    seo_title VARCHAR(200),
    seo_description VARCHAR(300),
    og_image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_status_published_at ON blog_posts (status, published_at DESC);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN (search_vector);
CREATE INDEX idx_blog_posts_featured ON blog_posts (is_featured) WHERE is_featured = TRUE;

CREATE OR REPLACE FUNCTION blog_posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content_html, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_search_vector_trigger
BEFORE INSERT OR UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION blog_posts_search_vector_update();

CREATE TABLE blog_categories (
    category_id UUID PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_tags (
    tag_id UUID PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_post_categories (
    post_id UUID NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES blog_categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE TABLE blog_post_tags (
    post_id UUID NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES blog_tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE blog_post_revisions (
    revision_id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content_json JSONB NOT NULL,
    edited_by_admin_id UUID NOT NULL REFERENCES admins(admin_id),
    edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_post_revisions_post_id ON blog_post_revisions (post_id, edited_at DESC);

COMMENT ON COLUMN blog_posts.content_json IS
    'TipTap editor document (source of truth) — content_html is derived from this, never edited directly.';
COMMENT ON COLUMN blog_posts.author_admin_id IS
    'References admins, not users — blogging is an admin-only feature.';

COMMIT;
