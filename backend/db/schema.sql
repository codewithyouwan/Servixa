-- Enable the pgvector extension for AI-driven vector similarity searches
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- #region ENUMS, DOMAINS & LOOKUPS
-- ==========================================

CREATE TYPE user_type AS ENUM ('homeowner', 'contractor', 'company');
CREATE TYPE contractor_type AS ENUM ('individual', 'organization');
CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'delayed', 'cancelled');
CREATE TYPE order_status AS ENUM ('ordered', 'in_transit', 'cancelled', 'dispatched', 'completed');
CREATE TYPE payment_method AS ENUM ('cash', 'online');

-- Added 'ai_use' for AI/Vector search documents
-- Added 'invoice', 'photo', 'manual' for the Homeowner Digital Twin (docs table reused
-- rather than five separate tables — same entity shape: a file owned by a user).
-- Added 'license', 'insurance', 'contract' for the Contractor CRM's Documents
-- section — same reuse: a contractor's business docs are still just a file
-- owned by a user, so this is the same `docs` table + metadata JSONB, not a
-- new table. 'photo' and 'legal' are shared with the other two doc sets.
-- Added 'spec_sheet', 'marketing', 'install_guide' for Brand Profile's
-- Downloads section — third reuse of the same table/pattern ('manual' was
-- already here from the Digital Twin, covers Downloads' manual category too).
CREATE TYPE doc_type AS ENUM (
    'verification', 'warranty', 'receipt', 'legal', 'ai_use',
    'invoice', 'photo', 'manual',
    'license', 'insurance', 'contract',
    'spec_sheet', 'marketing', 'install_guide'
);

-- #endregion

-- ==========================================
-- #region CORE USER MANAGEMENT
-- ==========================================

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuidv7(),
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_country VARCHAR(100) NOT NULL,
    user_addr JSONB NOT NULL,
    user_type user_type NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag to retain some info of the user (we'll delete data in the dependent tables accordingly but not from this.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by uuid
);

-- Feature 3 (Brand Profile) reuses this table as-is: the product-facing
-- role/label is "brand" (see UserRole in app/schemas/user.py), but the DB
-- enum/table name predates that feature and says "company" — same naming
-- split already established for service_provider (role) vs. contractor (DB
-- enum). company_details JSONB holds the Brand Profile's Company Overview
-- fields (tagline, description, website, foundedYear, certifications,
-- contact info) — free-form for the same reason order_details/metadata are
-- JSONB elsewhere: the field set doesn't need to be queried relationally yet.
CREATE TABLE company (
    company_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR NOT NULL UNIQUE,
    company_details JSONB NOT NULL
);

-- Backs Brand Profile's "Products / Services" section directly — no new
-- table needed, this already had the right shape.
CREATE TABLE company_products (
    product_id uuid PRIMARY KEY DEFAULT uuidv7(),
    company_id uuid REFERENCES company(company_id) ON DELETE CASCADE,
    item_name VARCHAR NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    item_description TEXT NOT NULL, -- Changed to TEXT to allow rich descriptions for vectorization
    other_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid REFERENCES users(user_id) ON DELETE SET NULL, 
    updated_at TIMESTAMPTZ,
    updated_by uuid REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE docs (
    doc_id uuid PRIMARY KEY DEFAULT uuidv7(),
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    doc_name VARCHAR(150) NOT NULL,
    doc_type doc_type NOT NULL,
    doc_url TEXT NOT NULL,
    -- Category-specific structured fields (vendor, amount, expiry, linked appliance,
    -- tags...). Kept as JSONB instead of a column-per-category or a table-per-category
    -- because the field set differs per doc_type and none of it needs to be queried
    -- relationally yet — same tradeoff already made for order_details/company_details
    -- elsewhere in this schema.
    metadata JSONB,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Home Digital Twin: chronological service/maintenance log for a home, separate from
-- `docs` because an entry isn't a file — it's a record of work done, optionally backed
-- by one (e.g. the invoice for that visit).
CREATE TABLE service_records (
    service_record_id uuid PRIMARY KEY DEFAULT uuidv7(),
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    contractor_name VARCHAR(150),
    work_performed TEXT NOT NULL,
    cost BIGINT,
    linked_doc_id uuid REFERENCES docs(doc_id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    order_id uuid PRIMARY KEY DEFAULT uuidv7(), 
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    order_details JSONB NOT NULL,
    order_status order_status NOT NULL DEFAULT 'ordered',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion

-- ==========================================
-- #region SERVICE PROVIDERS (CONTRACTORS)
-- ==========================================

CREATE TABLE categories (
    category_id uuid PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(250) NOT NULL UNIQUE,
    category_description TEXT NOT NULL,
    meta_data JSONB
);

CREATE TABLE service_providers (
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL UNIQUE, 
    contractor_type contractor_type NOT NULL,
    avg_ratings NUMERIC(3,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    -- (Removed verification_docs JSONB as documents are now fully standardized inside the 'docs' table)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_providers_categories (
    user_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);

-- #endregion

-- ==========================================
-- #region SUBSCRIPTION SYSTEM
-- ==========================================

CREATE TABLE subscriptions (
    subscription_id uuid PRIMARY KEY DEFAULT uuidv7(),
    subscription_name VARCHAR(100) NOT NULL UNIQUE,
    subscription_amount BIGINT NOT NULL,
    subscription_period INTERVAL NOT NULL,
    metadata JSONB,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE user_subscriptions (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES subscriptions(subscription_id),
    starting_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_time TIMESTAMPTZ NOT NULL,
    charged_amount BIGINT NOT NULL DEFAULT 0
);

-- #endregion

-- ==========================================
-- #region OPERATIONS (PROJECTS, TASKS, PAYMENTS & RATINGS)
-- ==========================================

CREATE TABLE projects (
    project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    assignee_user_id uuid NOT NULL REFERENCES users(user_id),
    assigned_to_user_id uuid NOT NULL REFERENCES users(user_id),
    quote_price BIGINT NOT NULL, 
    status project_status DEFAULT 'pending',
    cancelling_reason VARCHAR(500),
    cancelled_by uuid REFERENCES users(user_id),
    delay_reason VARCHAR(500),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    time_period INTERVAL NOT NULL,
    
    CONSTRAINT chk_cancellation CHECK (
        (status = 'cancelled' AND cancelling_reason IS NOT NULL AND cancelled_by IS NOT NULL) OR 
        (status != 'cancelled')
    ),
    CONSTRAINT chk_delay CHECK (
        (status = 'delayed' AND delay_reason IS NOT NULL) OR 
        (status != 'delayed')
    )
);

CREATE TABLE project_tasks (
    task_id uuid PRIMARY KEY DEFAULT uuidv7(),
    project_id uuid REFERENCES projects(project_id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ
);

CREATE TABLE project_payments (
    project_id uuid NOT NULL PRIMARY KEY REFERENCES projects(project_id) ON DELETE CASCADE,
    payer_id uuid NOT NULL REFERENCES users(user_id),
    paid_to uuid NOT NULL REFERENCES users(user_id),
    price BIGINT NOT NULL, 
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_through payment_method NOT NULL,
    payment_receipts TEXT[]
);

-- Contractor CRM: quotes + invoices. Deliberately NOT wired to `projects`/
-- `project_payments` — those two don't yet match the shape the rest of this
-- app's mocked API contract already relies on (project_payments assumes a
-- payment already happened; projects has no title/budget/category columns
-- the API returns). Reconciling that is a separate, larger migration; these
-- two tables are scoped directly by contractor_id/homeowner_id so the CRM
-- has a clean, real backing store without taking on that reconciliation now.
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'declined', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');

CREATE TABLE quotes (
    quote_id uuid PRIMARY KEY DEFAULT uuidv7(),
    contractor_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    homeowner_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id uuid REFERENCES projects(project_id) ON DELETE SET NULL, -- optional link once a real project exists
    title VARCHAR(200) NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]', -- [{description, quantity, unitPrice}]
    amount BIGINT NOT NULL,
    status quote_status NOT NULL DEFAULT 'draft',
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    -- Populated once accepted — an "Order" in the CRM is just an accepted
    -- quote with scheduling info, not a separate table.
    scheduled_date DATE,
    completed_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ
);

CREATE TABLE invoices (
    invoice_id uuid PRIMARY KEY DEFAULT uuidv7(),
    quote_id uuid NOT NULL REFERENCES quotes(quote_id) ON DELETE CASCADE,
    contractor_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    homeowner_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ratings (
    rating_id uuid PRIMARY KEY DEFAULT uuidv7(),
    rated_by uuid NOT NULL REFERENCES users(user_id),
    rated_for uuid NOT NULL REFERENCES users(user_id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    rating_text VARCHAR(200) DEFAULT NULL,
    rating_attachments TEXT[] CONSTRAINT max_two_images CHECK (cardinality(rating_attachments) <= 2),
    rated_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ DEFAULT NULL
);

-- #endregion

-- ==========================================
-- #region BRAND PROFILE
-- ==========================================
-- Company Overview -> `company` table (see CORE USER MANAGEMENT above).
-- Products/Services -> `company_products` (same). Downloads -> `docs` table
-- (same one Feature 1/2 use — see doc_type enum above). Projects (case
-- studies), Dealers & Distributors, and Support tickets get new tables below:
-- nothing existing matched those shapes closely enough to reuse.

CREATE TABLE brand_projects (
    brand_project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150),
    completion_date DATE,
    image_url TEXT,
    linked_products TEXT[], -- product names — informal reference, same tradeoff as rating_attachments elsewhere
    linked_contractor_id uuid REFERENCES service_providers(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brand_dealers (
    dealer_id uuid PRIMARY KEY DEFAULT uuidv7(),
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    region VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website TEXT,
    linked_contractor_id uuid REFERENCES service_providers(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE ticket_status AS ENUM ('open', 'resolved');

CREATE TABLE brand_support_tickets (
    ticket_id uuid PRIMARY KEY DEFAULT uuidv7(),
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    submitted_by uuid REFERENCES users(user_id) ON DELETE SET NULL,
    submitted_by_name VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- FAQs are deliberately NOT a table for v1 — static Q&A copy the brand admin
-- edits rarely, same category as the auth flow's account-type marketing copy
-- (frontend/app/components/auth/auth-panel-copy.tsx). Served as a plain list
-- from mock_data.py / fixtures.ts; promote to a table if/when brands need to
-- self-edit FAQs through the UI.

-- #endregion

-- ==========================================
-- #region CHATS & MESSAGING
-- ==========================================

CREATE TABLE chat_rooms (
    room_id uuid PRIMARY KEY DEFAULT uuidv7(),
    project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_participants (
    room_id uuid NOT NULL REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE messages (
    msg_id uuid PRIMARY KEY DEFAULT uuidv7(),
    room_id uuid NOT NULL REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message_type VARCHAR NOT NULL DEFAULT 'conversation',
    message_content TEXT,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion

-- ==========================================
-- #region AI RECOMMENDATION ENGINE & VECTORS
-- ==========================================

-- Past projects completed by service providers (for semantic profiling) [we'll have to build a doc-parser in order to parse the documents given or we can take form inputs (much easier!!!)]
CREATE TABLE provider_past_projects (
    past_project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    provider_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget BIGINT,
    completed_at TIMESTAMPTZ,
    project_metadata JSONB -- Flexible details like location, actual materials, or custom metadata
);

-- Vector embeddings of documents (used for 'ai_use' documents mapping to contractors)
-- *Using 1536 dimensions (standard for OpenAI, Cohere, or local pgvector embeddings)
CREATE TABLE doc_embeddings (
    doc_id uuid PRIMARY KEY REFERENCES docs(doc_id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL,
    last_indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vector embeddings of company products
CREATE TABLE product_embeddings (
    product_id uuid PRIMARY KEY REFERENCES company_products(product_id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL,
    last_indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead pipeline status. A "lead" (Contractor CRM) IS a row in
-- project_contractor_matches — the AI already computes "this project matches
-- this contractor" here; a lead is just that match plus what the contractor
-- did about it. Reusing the table instead of adding a parallel `leads` table.
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

-- Cache table to serve compatibility scoring between projects and contractors quickly.
-- Doubles as the Contractor CRM's Leads list (see lead_status above).
CREATE TABLE project_contractor_matches (
    project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    contractor_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL, -- e.g., 94.50% compatibility
    matching_reasons JSONB, -- Context on why they matched (e.g., {"reason": "Matches past plumbing scopes"})
    status lead_status NOT NULL DEFAULT 'new',
    responded_at TIMESTAMPTZ,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, contractor_id)
);

-- Cache table to recommend compatible products for specific projects
CREATE TABLE project_product_matches (
    project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES company_products(product_id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL,
    matching_reasons JSONB,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, product_id)
);

-- #endregion

-- ==========================================
-- #region AI AGENT INTERACTIONS & LOGS
-- ==========================================

CREATE TYPE agent_role AS ENUM ('system', 'user', 'assistant', 'tool');

-- 1. Tracks unique interaction sessions with the AI agent
CREATE TABLE ai_conversations (
    conversation_id uuid PRIMARY KEY DEFAULT uuidv7(),
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id uuid REFERENCES projects(project_id) ON DELETE SET NULL, -- Nullable if it's a general help/onboarding chat (in the starting it'll be null as we only allow user to )
    title VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stores sequential LLM-style message exchanges for conversation context
CREATE TABLE ai_conversation_messages (
    message_id uuid PRIMARY KEY DEFAULT uuidv7(),
    conversation_id uuid NOT NULL REFERENCES ai_conversations(conversation_id) ON DELETE CASCADE,
    role agent_role NOT NULL, -- system, user, assistant, or tool
    content TEXT NOT NULL, -- Raw message content
    
    -- Optional internal fields for auditing & UI rendering
    agent_thought TEXT, -- Stores the "Chain of Thought" (reasoning steps) hidden from the user
    tokens_used INT, -- Good for monitoring LLM costs
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tracks specific actions/tools the AI Agent called during the chat 
-- (e.g., "AI searched for plumbers in Tokyo", "AI ran vector search on product catalog")
CREATE TABLE ai_agent_actions (
    action_id uuid PRIMARY KEY DEFAULT uuidv7(),
    message_id uuid NOT NULL REFERENCES ai_conversation_messages(message_id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL, -- e.g., 'vector_search_contractors', 'fetch_user_profile'
    tool_input JSONB, -- The parameters the AI passed to your backend
    tool_output JSONB, -- What your system returned back to the AI
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast sequential rendering of a conversation
CREATE INDEX idx_ai_messages_ordered 
ON ai_conversation_messages (conversation_id, created_at ASC);

-- #endregion