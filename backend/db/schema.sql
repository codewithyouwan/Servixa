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
-- Added 'invoice', 'photo', 'manual' for the Homeowner Digital Twin;
-- 'license', 'insurance', 'contract' for the Service-Provider CRM's business
-- documents; 'spec_sheet', 'marketing', 'install_guide' for Brand Profile
-- downloads. All three features store their files in this same `docs`
-- table (just filtered by doc_type + owning user_id) rather than one table
-- per feature — see backend/app/{homeowner,service_provider,brand} for the
-- module-specific views over it.
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
CREATE TABLE countries (
    code CHAR(2) PRIMARY KEY,              -- ISO 3166-1 alpha-2 (e.g., 'US', 'JP', 'GB')
    code_alpha3 CHAR(3) UNIQUE NOT NULL,   -- ISO 3166-1 alpha-3 (e.g., 'USA', 'JPN', 'GBR')
    name VARCHAR(100) NOT NULL,            -- e.g., 'United States', 'Japan'
    phone_code VARCHAR(10),                -- e.g., '+1', '+81'
    
    -- Currency details
    currency_code CHAR(3) NOT NULL,        -- ISO 4217 code (e.g., 'USD', 'JPY', 'EUR')
    currency_name VARCHAR(50) NOT NULL,    -- e.g., 'US Dollar', 'Japanese Yen'
    currency_symbol VARCHAR(10) NOT NULL   -- e.g., '$', '¥', '€'
);

-- Index for searching/filtering by currency code (e.g., during payments or multi-currency pricing)
CREATE INDEX idx_countries_currency ON countries (currency_code);

CREATE TABLE users (
    -- user_id uuid PRIMARY KEY DEFAULT uuidv7(),
    user_id uuid PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_country VARCHAR(100) NOT NULL REFERENCES countries(code),
    user_addr JSONB NOT NULL,
    user_type user_type NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag to retain some info of the user (we'll delete data in the dependent tables accordingly but not from this.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by uuid
);

CREATE TABLE company (
    company_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR NOT NULL UNIQUE,
    company_details JSONB NOT NULL
);

CREATE TABLE company_products (
    -- product_id uuid PRIMARY KEY DEFAULT uuidv7(),
    product_id uuid PRIMARY KEY,
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
    -- doc_id uuid PRIMARY KEY DEFAULT uuidv7(), 
    doc_id uuid PRIMARY KEY ,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    doc_name VARCHAR(150) NOT NULL,
    doc_type doc_type NOT NULL,
    doc_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    -- order_id uuid PRIMARY KEY DEFAULT uuidv7(), 
    order_id uuid PRIMARY KEY , 
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
    -- category_id uuid PRIMARY KEY DEFAULT uuidv7(),
    category_id uuid PRIMARY KEY ,
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
    -- subscription_id uuid PRIMARY KEY DEFAULT uuidv7(),
    subscription_id uuid PRIMARY KEY ,
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
    -- project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    project_id uuid PRIMARY KEY ,
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
    -- task_id uuid PRIMARY KEY DEFAULT uuidv7(),
    task_id uuid PRIMARY KEY ,
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

CREATE TABLE ratings (
    -- rating_id uuid PRIMARY KEY DEFAULT uuidv7(),
    rating_id uuid PRIMARY KEY ,
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
-- #region CHATS & MESSAGING
-- ==========================================

CREATE TABLE chat_rooms (
    -- room_id uuid PRIMARY KEY DEFAULT uuidv7(),
    room_id uuid PRIMARY KEY ,
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
    -- msg_id uuid PRIMARY KEY DEFAULT uuidv7(),
    msg_id uuid PRIMARY KEY ,
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
    -- past_project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    past_project_id uuid PRIMARY KEY ,
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

-- Cache table to serve compatibility scoring between projects and contractors quickly
CREATE TABLE project_contractor_matches (
    project_id uuid NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    contractor_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL, -- e.g., 94.50% compatibility
    matching_reasons JSONB, -- Context on why they matched (e.g., {"reason": "Matches past plumbing scopes"})
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
    -- conversation_id uuid PRIMARY KEY DEFAULT uuidv7(),
    conversation_id uuid PRIMARY KEY ,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id uuid REFERENCES projects(project_id) ON DELETE SET NULL, -- Nullable if it's a general help/onboarding chat (in the starting it'll be null as we only allow user to )
    title VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stores sequential LLM-style message exchanges for conversation context
CREATE TABLE ai_conversation_messages (
    -- message_id uuid PRIMARY KEY DEFAULT uuidv7(),
    message_id uuid PRIMARY KEY ,
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
    -- action_id uuid PRIMARY KEY DEFAULT uuidv7(),
    action_id uuid PRIMARY KEY ,
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


-- ==========================================
-- #region ADMIN SYSTEM & MANAGEMENT
-- ==========================================

CREATE TYPE admin_role AS ENUM ('super_admin', 'support_admin', 'moderator');

CREATE TABLE admins (
    -- admin_id uuid PRIMARY KEY DEFAULT uuidv7(),
    admin_id uuid PRIMARY KEY ,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role admin_role NOT NULL DEFAULT 'moderator',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- System Audit Log (Track admin operations like banning users, editing projects)
CREATE TABLE admin_audit_logs (
    -- log_id uuid PRIMARY KEY DEFAULT uuidv7(),
    log_id uuid PRIMARY KEY,
    admin_id uuid NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- e.g., 'soft_delete_user', 'verify_contractor'
    target_table VARCHAR(100) NOT NULL,
    target_id uuid NOT NULL,
    details JSONB,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion
-- ==========================================
-- #region PUBLIC ANNOUNCEMENTS & BANNERS
-- ==========================================

CREATE TABLE public_announcements (
    -- announcement_id uuid PRIMARY KEY DEFAULT uuidv7(),
    announcement_id uuid PRIMARY KEY ,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    cta_link TEXT, -- Optional link for banner button click
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    display_end TIMESTAMPTZ, -- NULL means display indefinitely until deactivated
    created_by uuid NOT NULL REFERENCES admins(admin_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_display_time CHECK (
        display_end IS NULL OR display_end > display_start
    )
);

-- Fast partial index for querying currently active banners on website navbar load
CREATE INDEX idx_active_public_announcements 
ON public_announcements (display_start, display_end) 
WHERE is_active = TRUE;

-- #endregion

-- ==========================================
-- #region SITE ANALYTICS & TELEMETRY
-- ==========================================
CREATE TYPE event_category AS ENUM ('page_view', 'ui_click', 'api_call', 'feature_usage');
CREATE TYPE event_device AS ENUM ('web', 'mobile', 'api');

CREATE TABLE telemetry_events (
    -- event_id uuid PRIMARY KEY DEFAULT uuidv7(),
    event_id uuid PRIMARY KEY ,
    
    -- Identity & Context
    user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
    session_id uuid, -- Groups consecutive page views and actions within a single visit
    
    -- Event Classification
    category event_category NOT NULL,
    device event_device NOT NULL DEFAULT 'web', -- Identifies client environment (web app, mobile app, external API call)
    event_key VARCHAR(150) NOT NULL,            -- Standardized format: 'page:/projects', 'click:submit_quote', 'api:POST/chat'
    
    -- Performance Metrics (Crucial for identifying bottlenecks and scaling individual routes)
    response_time_ms INT, -- Latency in ms (API execution or Page render time)
    status_code SMALLINT, -- HTTP status codes (200, 429, 500, etc.)
    
    -- Dynamic Details (Context-specific properties)
    -- Web/Mobile Click: {"element_id": "btn_hire", "component": "ContractorCard"}
    -- API Call: {"endpoint": "/v1/chat", "tokens_used": 350}
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound Index for fast aggregation & dashboards filtered by platform and key
CREATE INDEX idx_telemetry_device_key_time 
ON telemetry_events (device, event_key, created_at DESC);

-- Index for analyzing error spikes per category/device
CREATE INDEX idx_telemetry_category_device 
ON telemetry_events (category, device, created_at DESC);

-- #endregion
CREATE TABLE metric_hourly_rollups (
    rollup_time TIMESTAMPTZ NOT NULL,
    event_key VARCHAR(150) NOT NULL,
    category event_category NOT NULL,
    device event_device NOT NULL, -- on hourly basis which device is consuming our resources.
    
    total_hits BIGINT NOT NULL DEFAULT 0,
    error_count BIGINT NOT NULL DEFAULT 0,
    avg_response_time_ms INT DEFAULT 0,
    p95_response_time_ms INT DEFAULT 0,
    
    PRIMARY KEY (rollup_time, event_key, device)
);

-- ==========================================
-- #region HOMEOWNER DIGITAL TWIN
-- ==========================================
-- Invoices/warranties/photos/manuals reuse the `docs` table above (see the
-- doc_type enum extension) — this table is only for the service-history
-- log, which isn't a file.

CREATE TABLE service_records (
    -- service_record_id uuid PRIMARY KEY DEFAULT uuidv7(),
    service_record_id uuid PRIMARY KEY ,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    service_date TIMESTAMPTZ NOT NULL,
    contractor_name VARCHAR(150),
    work_performed TEXT NOT NULL,
    cost BIGINT,
    linked_doc_id uuid REFERENCES docs(doc_id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion

-- ==========================================
-- #region SERVICE-PROVIDER CRM
-- ==========================================
-- Business documents (licenses/insurance/contracts/photos) reuse the same
-- `docs` table. Orders and Customers are *derived* (an Order is an accepted
-- quote; a Customer is the distinct people across a provider's leads and
-- quotes) so they don't get their own tables — see
-- backend/app/service_provider/services/crm_service.py.

CREATE TYPE crm_lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE crm_quote_status AS ENUM ('draft', 'sent', 'accepted', 'declined', 'expired');
CREATE TYPE crm_invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');

CREATE TABLE crm_leads (
    -- lead_id uuid PRIMARY KEY DEFAULT uuidv7(),
    lead_id uuid PRIMARY KEY ,
    provider_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    project_title VARCHAR(255) NOT NULL,
    category_id uuid REFERENCES categories(category_id),
    estimated_value BIGINT,
    source VARCHAR(100) NOT NULL,
    status crm_lead_status NOT NULL DEFAULT 'new',
    match_score SMALLINT,
    match_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crm_quotes (
    -- quote_id uuid PRIMARY KEY DEFAULT uuidv7(),
    quote_id uuid PRIMARY KEY ,
    provider_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    lead_id uuid REFERENCES crm_leads(lead_id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    line_items JSONB NOT NULL, -- [{description, quantity, unitPrice}, ...] — no separate line-item table, same reasoning as orders.order_details
    amount BIGINT NOT NULL,
    status crm_quote_status NOT NULL DEFAULT 'draft',
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_date DATE,
    completed_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ
);

CREATE TABLE crm_invoices (
    -- invoice_id uuid PRIMARY KEY DEFAULT uuidv7(),
    invoice_id uuid PRIMARY KEY ,
    quote_id uuid NOT NULL REFERENCES crm_quotes(quote_id) ON DELETE CASCADE,
    provider_id uuid NOT NULL REFERENCES service_providers(user_id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    amount BIGINT NOT NULL,
    status crm_invoice_status NOT NULL DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion

-- ==========================================
-- #region BRAND PROFILE
-- ==========================================
-- Company Overview -> the existing `company` table; Products/Services ->
-- the existing `company_products` table; Downloads -> the `docs` table
-- (see the doc_type enum extension). Case-study projects, dealers, and
-- support tickets are new tables below. FAQs are static copy owned by the
-- application, not the database.

CREATE TYPE ticket_status AS ENUM ('open', 'resolved');

CREATE TABLE brand_projects (
    -- brand_project_id uuid PRIMARY KEY DEFAULT uuidv7(),
    brand_project_id uuid PRIMARY KEY ,
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150),
    completion_date DATE,
    image_url TEXT,
    linked_products TEXT[], -- product names as shown in the case study; not a hard FK since a case study may reference a discontinued/renamed product
    linked_contractor_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brand_dealers (
    -- dealer_id uuid PRIMARY KEY DEFAULT uuidv7(),
    dealer_id uuid PRIMARY KEY ,
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    region VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    website TEXT,
    linked_contractor_name VARCHAR(150)
);

CREATE TABLE brand_support_tickets (
    -- ticket_id uuid PRIMARY KEY DEFAULT uuidv7(),
    ticket_id uuid PRIMARY KEY ,
    company_id uuid NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_by_name VARCHAR(150) NOT NULL,
    submitted_by_user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- #endregion