# Database Schema — AI Construction Marketplace (MVP)

No `docs/database.md` existed in the repo, so this schema is designed from `docs/product-spec.md` and constrained by `CLAUDE.md` (MVP only, no enterprise features, scalable database, type safety).

## 1. Design principles

- **Engine**: PostgreSQL. Relational integrity matters here — a quote belongs to exactly one project and one contractor, a review belongs to exactly one completed project. Postgres also gives us JSONB for the few genuinely flexible fields (AI-generated scope of work, project metadata) without giving up constraints everywhere else.
- **ORM**: Prisma. Recommended over TypeORM for this stack because its generated client gives end-to-end type inference into NestJS services with no manual entity decoration, and its migration workflow (`prisma migrate`) is simpler to run in CI than TypeORM's. This is a recommendation, not a hard requirement — the schema below is expressed in engine-neutral terms so it maps cleanly to either.
- **Primary keys**: UUID (v4) everywhere. Avoids leaking sequential IDs (e.g. total user count) and makes future multi-region/multi-database merging (Phase 5 global expansion) conflict-free, at negligible cost for MVP scale.
- **Timestamps**: every table gets `created_at`, `updated_at`. Tables with a lifecycle (users, contractor profiles, projects) also get `deleted_at` for soft deletes — homeowners and contractors need to disappear from search without destroying historical project/quote/review records.
- **One `users` table, not one-table-per-role**: a single identity table with a `role` enum, joined to a role-specific profile table (`homeowner_profiles`, `contractor_profiles`). This avoids duplicating auth/session/notification logic three times and matches how a person could plausibly hold more than one role later (e.g. a contractor who is also a homeowner) without a schema change.
- **Money**: stored as integer cents (`budget_min_cents`, `amount_cents`), never floats. Currency code stored alongside (`currency` = `USD` for MVP) so Phase 5 (multi-country) doesn't require a migration, just populating a column that already exists.
- **What's excluded from MVP tables**: wallet, brand profiles, campaign management, and AI-credit ledgers appear in the product spec but are Phase 2+ monetization/enterprise features per CLAUDE.md. They are addressed in `06-future-scalability.md` as additive tables that hang off this schema without altering it — nothing here is designed in a way that would require reshaping core tables to add them later.

## 2. Core entities

### `users`
Identity and auth, shared by all roles.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| email | varchar, unique | nullable if phone-only signup |
| phone | varchar, unique | E.164 format, nullable if email-only signup |
| password_hash | varchar, nullable | null for OAuth-only accounts |
| role | enum(`homeowner`,`contractor`,`admin`) | see `04-authentication-and-roles.md` |
| auth_provider | enum(`password`,`google`,`otp`) | |
| email_verified_at | timestamptz, nullable | |
| phone_verified_at | timestamptz, nullable | |
| status | enum(`active`,`suspended`,`deleted`) | admin-controlled |
| created_at / updated_at / deleted_at | timestamptz | |

### `homeowner_profiles`
1:1 with `users` where `role = homeowner`.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users, unique | |
| full_name | varchar | |
| address_line1 / city / state / zip | varchar | US-only for MVP; no country column needed yet — added in Phase 5 |
| avatar_url | varchar, nullable | points to object storage, see §5 |

### `contractor_profiles`
1:1 with `users` where `role = contractor`.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users, unique | |
| business_name | varchar | |
| business_description | text, nullable | |
| service_area_zip_codes | text[] | simple MVP approach; see scalability doc for geo-radius upgrade |
| trust_score | numeric(4,2), default 0 | computed field, see §4 |
| verification_status | enum(`unverified`,`pending`,`verified`,`rejected`) | |
| is_platform_added | boolean, default false | supports "manual entry by founders" flow from product spec |
| avatar_url / cover_photo_url | varchar, nullable | |

### `contractor_service_categories`
Many-to-many: a contractor can serve multiple categories.

| Column | Type | Notes |
|---|---|---|
| contractor_id | uuid, FK → contractor_profiles | |
| category | enum(`general_contractor`,`electrical`,`plumbing`,`hvac`,`roofing`,`flooring`,`painting`,`carpentry`,`masonry`,`waterproofing`,`solar`,`smart_home`, …) | composite PK with contractor_id |

### `contractor_documents`
License/insurance uploads driving KYC verification.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| contractor_id | uuid, FK → contractor_profiles | |
| type | enum(`license`,`insurance`,`business_registration`,`id`) | |
| file_url | varchar | object storage key |
| status | enum(`pending`,`approved`,`rejected`) | reviewed by admin |
| reviewed_by | uuid, FK → users, nullable | admin who reviewed |
| reviewed_at | timestamptz, nullable | |

### `projects`
A homeowner's job posting.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| homeowner_id | uuid, FK → homeowner_profiles | |
| category | enum | same set as `contractor_service_categories.category` |
| title | varchar | |
| description | text | homeowner-entered |
| ai_generated_scope | jsonb, nullable | structured scope of work produced by the AI Project Assistant |
| budget_min_cents / budget_max_cents | integer, nullable | |
| currency | varchar(3), default `USD` | |
| zip_code / city / state | varchar | |
| desired_timeline | enum(`asap`,`1_3_months`,`3_6_months`,`flexible`) | |
| status | enum(`draft`,`open`,`matched`,`in_progress`,`completed`,`cancelled`) | |
| created_at / updated_at | timestamptz | |

### `project_media`
Photos/videos attached to a project.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| project_id | uuid, FK → projects | |
| file_url | varchar | |
| media_type | enum(`image`,`video`) | |
| uploaded_at | timestamptz | |

### `leads`
The output of the matching engine: a project offered to a specific contractor.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| project_id | uuid, FK → projects | |
| contractor_id | uuid, FK → contractor_profiles | |
| match_score | numeric(5,2) | computed at distribution time |
| status | enum(`sent`,`viewed`,`accepted`,`declined`,`expired`) | |
| sent_at / responded_at | timestamptz | response time feeds `trust_score` |

Design note: `leads` is deliberately separate from `quotes`. A lead is "this project was shown to this contractor"; a quote is "this contractor responded with a price." Keeping them separate lets the matching engine be measured (lead quality scoring, response time, from the product spec's analytics goals) independently of quote content.

### `quotes`
A contractor's price/scope response to a project (max 5 per project per product spec).

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| project_id | uuid, FK → projects | |
| contractor_id | uuid, FK → contractor_profiles | |
| lead_id | uuid, FK → leads, nullable | |
| amount_cents | integer | |
| currency | varchar(3), default `USD` | |
| scope_of_work | text | |
| estimated_timeline_days | integer, nullable | |
| status | enum(`submitted`,`accepted`,`declined`,`withdrawn`) | |
| created_at / updated_at | timestamptz | |

### `conversations` / `messages`
In-app messaging between a homeowner and a contractor, scoped to a project.

| Table | Key columns |
|---|---|
| `conversations` | id (PK), project_id (FK), homeowner_id (FK), contractor_id (FK), created_at |
| `messages` | id (PK), conversation_id (FK), sender_id (FK → users), body (text, nullable), attachment_url (varchar, nullable), created_at, read_at (nullable) |

### `reviews`
Verified-project-only reviews per product spec.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| project_id | uuid, FK → projects, unique | one review per completed project |
| contractor_id | uuid, FK → contractor_profiles | |
| homeowner_id | uuid, FK → homeowner_profiles | |
| rating | smallint | 1–5, CHECK constraint |
| body | text, nullable | |
| created_at | timestamptz | |

### `notifications`
Fan-out record for email/SMS/push (actual delivery handled by the Notifications module, see API doc).

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users | |
| type | varchar | e.g. `quote_received`, `message_received`, `lead_offered` |
| payload | jsonb | |
| channel | enum(`email`,`sms`,`push`,`in_app`) | |
| read_at | timestamptz, nullable | |
| created_at | timestamptz | |

### `admin_audit_log`
Every admin action against another user's data is recorded — required given admins can manually create contractor profiles and review verification documents.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| admin_id | uuid, FK → users | |
| action | varchar | e.g. `contractor_verified`, `profile_created_manually` |
| target_table / target_id | varchar / uuid | polymorphic reference |
| metadata | jsonb, nullable | |
| created_at | timestamptz | |

## 3. Relationships (summary)

```
users 1──1 homeowner_profiles
users 1──1 contractor_profiles
contractor_profiles 1──* contractor_service_categories
contractor_profiles 1──* contractor_documents
homeowner_profiles 1──* projects
projects 1──* project_media
projects 1──* leads──1 contractor_profiles
projects 1──* quotes──1 contractor_profiles
projects 1──1 conversations (per contractor pairing, in MVP: one active conversation per accepted quote)
conversations 1──* messages
projects 1──1 reviews (post-completion)
users 1──* notifications
users(admin) 1──* admin_audit_log
```

## 4. Computed / derived fields

`contractor_profiles.trust_score` is not user-editable; it's recalculated by a scheduled job from: lead response time (`leads.responded_at - leads.sent_at`), quote acceptance rate, `reviews.rating` average, and project completion rate (`projects.status = completed` ratio). Keeping it as a stored, periodically-recomputed column (rather than calculating on every read) keeps contractor search fast, which matters more than millisecond-fresh accuracy for a ranking signal.

## 5. Media & file storage

No blobs live in Postgres. `file_url` / `avatar_url` / `attachment_url` columns store a reference (object storage key or CDN URL). Recommended provider: AWS S3 or Cloudflare R2 (R2 has no egress fees, which matters once portfolio galleries and project photos generate real bandwidth) — see `05-deployment.md`.

## 6. Indexing strategy (MVP scale)

- `projects (status, category, city, state)` — composite index backing contractor discovery/search.
- `contractor_profiles (verification_status, trust_score)` — backing ranked search results.
- `leads (contractor_id, status)` and `quotes (project_id)` — dashboard queries.
- `messages (conversation_id, created_at)` — pagination.
- Unique index on `users (email)` and `users (phone)` (partial, `WHERE deleted_at IS NULL`).

This is deliberately minimal. Postgres handles MVP-scale traffic (thousands, not millions, of projects) on straightforward B-tree indexes; premature composite/partial indexing beyond what current query patterns need would violate the "never generate unnecessary" principle. Search-specific indexing (trigram/full-text, geo) is addressed in `06-future-scalability.md` as a Phase 2+ upgrade, not built now.
