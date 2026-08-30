-- Migration 003: docs gains file_type + metadata — the generic docs table
-- (doc_id, user_id, doc_name, doc_type, doc_url, uploaded_at) has no room
-- for the category-specific optional fields all three doc-family features
-- need (homeowner Digital Twin: tags/vendor/amount/purchase_date/
-- order_number/brand/expires_at/linked_appliance/notes; CRM: issuer/
-- linked_customer/linked_quote_id; Brand downloads: linked_product_name).
-- metadata is a JSONB grab-bag for these, same "flexible details"
-- convention already used elsewhere (company_products.other_details,
-- orders.order_details). file_type is a real column since it's used for
-- filtering/display consistently across all three doc-family features.
--
-- doc_url also becomes nullable: none of DocumentCreate/CrmDocumentCreate/
-- DownloadCreate accept file bytes today (no upload endpoint exists yet),
-- so a doc row can be created with metadata only and a URL added later.

BEGIN;

ALTER TABLE docs
    ADD COLUMN file_type VARCHAR(20) NOT NULL DEFAULT 'pdf',
    ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ALTER COLUMN doc_url DROP NOT NULL;

CREATE INDEX idx_docs_user_type ON docs (user_id, doc_type);

COMMIT;
