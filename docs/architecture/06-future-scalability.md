# Future Scalability — AI Construction Marketplace

CLAUDE.md is explicit: don't build future enterprise features now. This document exists to show that not building them now doesn't box the platform in — each of the product spec's later phases (monetization, brands, ecosystem expansion, global expansion) attaches to the MVP architecture rather than requiring it to be reworked.

## 1. Modular monolith → services, only where it earns its cost

The NestJS module boundaries (`01-folder-structure.md`) are chosen so that three specific modules can be extracted into standalone services later without touching the rest of the system, because nothing else calls them directly — everything goes through their service interface:

- **`ai`** — already isolated behind `AiService`. If AI usage grows enough to need independent scaling/rate-limiting or a queue-based job model (e.g. long-running cost estimation), it becomes its own service; the rest of the app still calls the same interface, now over HTTP/queue instead of in-process.
- **`matching`** — the AI matching engine and lead distribution logic are self-contained. If matching needs a heavier compute model (ML-based ranking beyond rule-based scoring) or its own scaling profile, it splits out cleanly.
- **`notifications`** — already event-driven (fired off the message/lead/quote lifecycle). A natural candidate to become a queue-backed worker (BullMQ on Redis) once notification volume is high enough that fire-and-forget in the request path isn't good enough.

Everything else (users, projects, quotes, reviews) stays in the monolith — splitting core CRUD domains into services would add network calls and deployment complexity for no benefit at this data scale.

## 2. Database growth path

- **Connection pooling**: introduce PgBouncer (or the hosting provider's built-in pooler) once concurrent connections from the API's instances approach Postgres's connection limit — not needed at MVP instance counts, but a one-line addition when it is.
- **Read replicas**: search/browse queries (contractor discovery, project listings) are natural candidates to route to a read replica once write load on the primary becomes contended. The schema requires no changes for this — it's a connection-routing decision in the Prisma/data-access layer.
- **Partitioning**: `messages` and `notifications` are the tables most likely to grow unbounded. Both are designed with `created_at` as a natural partition key (by month) for when row counts justify it — not applied at MVP scale, where a plain B-tree index is sufficient.
- **Search**: contractor discovery starts on Postgres (`ILIKE` + the composite indexes in `02-database-schema.md`). Once catalog size and query complexity (fuzzy matching, ranked relevance across name/category/reviews) outgrow that, introduce a dedicated search index (Meilisearch is a lighter operational lift than Elasticsearch and fits this catalog size) fed by a change-data-capture or event-driven sync from Postgres — Postgres remains the source of truth.
- **Geo search**: MVP uses a `service_area_zip_codes` array (see database doc) — cheap and adequate for zip-level matching. A true radius search (PostGIS `geography` columns + `ST_DWithin`) is a targeted upgrade once "contractors within N miles" becomes a real product requirement rather than zip-code matching.

## 3. Caching

No cache layer in the MVP — Postgres handles the read volume directly. Redis is the natural addition when: (a) contractor search results need sub-100ms responses at higher traffic, (b) session/rate-limit state needs to be shared across multiple API instances (OTP rate limiting, idempotency keys — currently fine as in-memory or DB-backed at MVP instance counts), or (c) the notifications module moves to a queue (BullMQ requires Redis anyway, so this arrives bundled with that change).

## 4. Multi-region / global expansion (Phase 5)

The schema already carries `currency` (varchar(3)) on money fields and doesn't hard-code `USD` anywhere in constraints — Phase 5 (multiple countries, multiple currencies) is populating existing columns with new values, not migrating them. What Phase 5 does add, cleanly, as new tables/columns rather than schema rewrites:
- `users.locale` / `users.timezone` — not needed while the platform is US-only.
- `countries` / `regions` reference tables, with `homeowner_profiles`/`contractor_profiles` gaining a `country_code` column (defaulting to `US` for all existing rows).
- Region-specific compliance fields (e.g. VAT ID instead of US tax ID) as nullable columns, populated per country.

## 5. Brands, monetization, and the wallet (Phase 2–4)

These are explicitly out of MVP scope per CLAUDE.md, but the product spec asks that premium features, subscriptions, and billing be "built into the architecture from the outset" — reconciled here by designing the *attachment points*, not the features themselves:

- **Wallet**: would be a new `wallets` table (1:1 with `users`) plus a `wallet_transactions` ledger table, referencing `users.id`. It doesn't touch any existing table — it's purely additive.
- **Brand profiles**: a new `role` enum value (`brand`) plus a `brand_profiles` table, following the exact same pattern as `contractor_profiles`. Because roles are already modeled as profile tables joined to a single `users` identity table (see `02-database-schema.md` §1), adding a fourth role is additive, not a redesign.
- **Subscriptions/billing**: a `subscriptions` table (user_id, plan, status, billing_provider_ref) referencing `users.id`, populated once a payment provider (Stripe, per `05-deployment.md`) is integrated. Feature-gating (e.g. "premium brand profile fields") is a `subscriptions.plan` check in the relevant service, not a change to core domain tables.
- **Campaign management / sponsored placement**: a `campaigns` table referencing `brand_profiles`, independent of the core matching/project tables — the matching engine would read from it as an additional ranking input, not a required dependency.

## 6. Analytics & data flywheel (Phase 2+)

The product spec describes extensive analytics (pricing intelligence, lead scoring, LTV prediction). MVP captures the raw events this depends on for free, as a side effect of the core schema — `leads.match_score`/`sent_at`/`responded_at`, `quotes.amount_cents`, `reviews.rating`, `projects.status` transitions. Nothing needs to be added now to make this data available later; Phase 2 analytics work is a warehouse/ETL and modeling exercise (e.g. periodic export to a columnar store like BigQuery or a Postgres-based OLAP extension) reading from tables that already exist, not new instrumentation.

## 7. Summary: what changes, what doesn't

| Growth driver | What changes | What stays the same |
|---|---|---|
| Traffic growth | Add read replicas, caching, connection pooling | Core schema, module boundaries |
| Search complexity | Add dedicated search index, PostGIS | `projects`/`contractor_profiles` tables |
| New role (brands) | New role enum value + profile table | `users` identity table, RBAC pattern |
| Monetization | New wallet/subscription/campaign tables | Core marketplace tables (projects, quotes, leads) |
| Global expansion | Populate existing currency/locale columns, add country reference tables | Money-as-cents, UUID PKs, timestamp conventions |
| AI/matching complexity | Extract `ai`/`matching` modules into standalone services | Service interfaces the rest of the app already calls |

The throughline: every MVP decision in these documents (UUID keys, cents-based money, role-as-profile-table, module service interfaces) was chosen specifically because it's cheap now and additive later — not because it anticipates every future feature, but because it doesn't foreclose any of them.
