-- ENUMS & DOMAINS
CREATE TYPE user_type AS ENUM ('homeowner', 'contractor', 'company');
CREATE TYPE contractor_type AS ENUM ('individual', 'organization');
CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'delayed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'online');

-- 1. USERS TABLE
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_country VARCHAR(100) NOT NULL,
    user_type user_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES (Normalized for many-to-many mapping)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. CONTRACTORS TABLE
CREATE TABLE contractors (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL UNIQUE,
    contractor_type contractor_type NOT NULL,
    avg_ratings NUMERIC(3,2) DEFAULT 0.00, -- Adjusted to 3,2 to allow 5.00
    is_verified BOOLEAN DEFAULT FALSE,
    verification_docs TEXT[], -- Array of URLs
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction table for multiple categories per contractor
CREATE TABLE contractor_categories (
    user_id VARCHAR(255) REFERENCES contractors(user_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);

-- 4. SUBSCRIPTIONS MASTER
CREATE TABLE subscriptions (
    subscription_id VARCHAR(55) PRIMARY KEY,
    subscription_name VARCHAR(100) NOT NULL UNIQUE,
    subscription_amount BIGINT NOT NULL, -- Stored as whole numbers (e.g., Cents/Whole currency)
    subscription_period INTERVAL NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 5. USER SUBSCRIPTIONS (Historical/Active tracking)
CREATE TABLE user_subscriptions (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    subscription_id VARCHAR(55) REFERENCES subscriptions(subscription_id),
    starting_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_time TIMESTAMPTZ NOT NULL, -- Calculated as starting_time + subscription_period
    charged_amount BIGINT NOT NULL DEFAULT 0
);

-- 6. PROJECTS TABLE
CREATE TABLE projects (
    project_id VARCHAR(255) PRIMARY KEY,
    assignee_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    assigned_to_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    quote_price BIGINT NOT NULL, 
    status project_status DEFAULT 'pending',
    cancelling_reason VARCHAR(500),
    cancelled_by VARCHAR(255) REFERENCES users(user_id),
    delay_reason VARCHAR(500),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    time_period INTERVAL NOT NULL, -- e.g., '3 months 2 days'
    
    -- Business Logic Validation Constraints
    CONSTRAINT chk_cancellation CHECK (
        (status = 'cancelled' AND cancelling_reason IS NOT NULL AND cancelled_by IS NOT NULL) OR 
        (status != 'cancelled')
    ),
    CONSTRAINT chk_delay CHECK (
        (status = 'delayed' AND delay_reason IS NOT NULL) OR 
        (status != 'delayed')
    )
);

-- 7. PROJECT TASKS (Normalized away from standard string arrays)
CREATE TABLE project_tasks (
    task_id SERIAL PRIMARY KEY,
    project_id VARCHAR(255) REFERENCES projects(project_id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ
);

-- 8. PAYMENTS TABLE
CREATE TABLE project_payments (
    project_id VARCHAR(255) PRIMARY KEY REFERENCES projects(project_id) ON DELETE CASCADE,
    payer_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    paid_to VARCHAR(255) NOT NULL REFERENCES users(user_id),
    price BIGINT NOT NULL, 
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_through payment_method NOT NULL,
    payment_receipts TEXT[]
);

-- 9. RATINGS TABLE
CREATE TABLE ratings (
    rating_id VARCHAR(255) PRIMARY KEY,
    rated_by VARCHAR(255) NOT NULL REFERENCES users(user_id),
    rated_for VARCHAR(255) NOT NULL REFERENCES users(user_id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    rating_text VARCHAR(200) DEFAULT NULL,
    rating_attachments TEXT[] CONSTRAINT max_two_images CHECK (cardinality(rating_attachments) <= 2),
    rated_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ DEFAULT NULL
);