# MVP Technical Foundation & Roadmap

Prepared as Lead Software Architect. Sources read: `docs/product-spec.md`, `CLAUDE.md` (root). No `docs/roadmap.md` exists yet — this document proposes one (§7). This is a planning document only: no application code, no components, no API implementations. It builds on and consolidates the architecture already drafted in `docs/architecture/01-06` rather than replacing it — where a decision was already made there, it's restated briefly with a pointer, not redesigned.

Per CLAUDE.md's governing rule ("do not build future enterprise features," MVP-only, three roles: homeowner, contractor, admin), every recommendation below is scoped to what the MVP needs, with Phase 2+ items explicitly flagged rather than silently included.

---

## 1. Technology Stack

| Area | Recommendation | Why |
|---|---|---|
| **Frontend** | Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui | Fixed by CLAUDE.md. App Router's server components matter specifically here because the marketing site (SEO-critical, per the cost-guide/city-page strategy already designed) needs fast, crawlable, mostly-static pages, while the authenticated app needs client interactivity — one framework serves both without a second stack. |
| **Backend** | NestJS | Fixed by CLAUDE.md. Its module/DI system maps directly onto the bounded contexts already defined (auth, projects, quotes, matching, messaging) — each stays small and swappable rather than accreting into one large service file, which matters for "keep functions small" as a stated rule. |
| **Database** | PostgreSQL | Fixed by CLAUDE.md. Relational integrity is a real requirement here (a quote belongs to exactly one project and contractor; a review belongs to exactly one completed project) — a document store would push that integrity logic into application code instead of the database enforcing it. JSONB covers the genuinely flexible fields (AI-generated scope) without giving up constraints everywhere else. |
| **ORM** | Prisma | Not fixed by CLAUDE.md (left blank) — recommended over TypeORM because its generated client gives full type inference into NestJS services with less manual decoration, and its migration CLI is simpler to run in CI. This is a recommendation to confirm, not a locked decision (see §8). |
| **Authentication** | NestJS + Passport (JWT access/refresh, Google OAuth, phone OTP via Twilio) | Left blank in CLAUDE.md. Rolling auth in-house (vs. Auth0/Clerk) keeps the `users` table as the single source of truth for role + verification state, which matters because contractor KYC here is a multi-step, admin-reviewed workflow that a generic auth provider doesn't model — full reasoning in `docs/architecture/04-authentication-and-roles.md`. Auth0/Clerk remain valid if the team prioritizes build speed over that control (see §8). |
| **File Storage** | Cloudflare R2 (S3-compatible; AWS S3 as fallback) | Left blank. Needed for project photos, contractor license/insurance uploads, and portfolio galleries — none of which belong in Postgres as blobs. R2 specifically avoids egress fees, which matters once portfolio/photo bandwidth is real. Upload is presigned-URL based so the API never proxies file bytes. |
| **Search** | PostgreSQL full-text (`tsvector`/trigram) for MVP; Meilisearch as the defined upgrade path | Left blank. At MVP scale (thousands, not millions, of contractor profiles), a dedicated search engine is infrastructure the product doesn't need yet — adding it now would be exactly the kind of premature complexity CLAUDE.md's "never generate unnecessary" rule warns against. The upgrade trigger (catalog size, fuzzy-match/relevance requirements) is defined in `docs/architecture/06-future-scalability.md` so this isn't an open-ended deferral. |
| **AI Integration** | Provider-agnostic `AiService` interface (internal), backing implementation with Anthropic Claude as the recommended default | Left blank. The product spec's three AI features (Project Assistant scope generation, Smart Matching signal, Proposal Drafting) are all text-generation/structuring tasks Claude handles well. The interface — not the provider — is the actual architectural commitment: nothing in `projects`, `matching`, or `quotes` modules calls a vendor SDK directly, so the provider is a configuration change, not a rewrite, if that recommendation changes later. |
| **Maps** | Google Maps Platform (Geocoding + Places Autocomplete) | Left blank. US-only MVP; homeowners and contractors both expect standard address autocomplete. Mapbox is a legitimate cheaper alternative once volume makes Google's per-request cost material — noted as a revisit point, not a hard commitment. |
| **Payments** | Not built into the MVP core loop (no step in project → match → quote → hire requires it). Stripe is the recommended provider *when* wallet/escrow work begins | Left blank. Per CLAUDE.md's MVP-only principle, wallet and escrow (Project Protection Program) are Phase 2 features in the product spec, not core MVP. Stripe is named now, not to build now, but so the schema/API extension points (§8 flags this explicitly) aren't accidentally designed to preclude it. |
| **Notifications** | Resend or Postmark (email), Twilio (SMS/OTP), in-app notifications stored in Postgres and delivered over the same WebSocket connection used for messaging | Left blank. Browser/mobile push is deferred — there's no native mobile app in MVP scope, and web push adds a service-worker/permissions flow that isn't justified until there's a retention problem it's solving. |
| **Deployment** | Vercel (frontend), Railway or Render (containerized NestJS API), Neon or RDS (managed Postgres) | Left blank. Chosen for MVP velocity — `git push` to a running, health-checked deployment without hand-building VPC/ECS configuration first. Full reasoning and the AWS migration path once that configuration is actually justified: `docs/architecture/05-deployment.md`. |
| **Analytics** | Product analytics: PostHog (self-hostable, owns the event data referenced throughout the product spec's "Data Analytics & Decision Making" section — search patterns, quote win rate, lead quality). Site analytics: Vercel Analytics or Plausible for the marketing site | Left blank. Deliberately two separate tools: product analytics needs to answer marketplace-specific questions (funnel from project-post to hire) that a general web-analytics tool isn't built for, while the marketing site's traffic/SEO performance is a simpler, separate concern that doesn't need to touch the product event stream. |

---

## 2. Monorepo Structure

```
bestbuild/
├── apps/
│   ├── web/              # Next.js — marketing site + authenticated app, one deployable
│   └── api/               # NestJS — all backend business logic, one deployable
├── packages/
│   ├── shared/            # Cross-cutting TS types, DTOs, enums (ServiceCategory, ProjectStatus...)
│   ├── config/            # Shared eslint/tsconfig/tailwind config, kept out of each app to avoid drift
│   └── ui/                # (Introduce only once a second consumer of shared components exists —
│                           #  not created at MVP start; listed here as the reserved slot)
├── docs/
│   ├── product-spec.md
│   ├── architecture/       # This document and 01-06 (folder structure, DB schema, API, auth, deploy, scalability)
│   └── marketing-site/     # IA, navigation, page designs, wireframes
├── design/                 # Brand assets, exported illustrations/icons, any Figma-linked source files
├── infra/                  # Dockerfiles, CI workflow definitions, environment/secret templates (no secrets committed)
├── scripts/                # One-off maintenance/dev scripts (seed data, migration helpers)
└── package.json             # npm workspaces root
```

**Why this shape**: `apps/` holds exactly the two deployables — one frontend, one backend — matching the two-runtime architecture in §3. `packages/shared` is what makes "type safety" (a CLAUDE.md priority) real across the frontend/backend boundary rather than aspirational: a changed shape breaks the build immediately instead of failing at runtime. `docs/` and `design/` exist because this project's actual working history so far has been architecture and marketing-design documents — giving them permanent, version-controlled homes (rather than treating them as disposable chat output) is deliberate, not incidental. `infra/` is new relative to `01-folder-structure.md` — added here because this document is explicitly asked to plan deployment/CI, and Dockerfiles/CI config deserve a folder rather than living loose at the repo root once there's more than one of them.

---

## 3. High-Level Architecture

```
                                   ┌─────────────────┐
                                   │     Browser      │
                                   └────────┬─────────┘
                                            │ HTTPS
                                            ▼
                          ┌──────────────────────────────────┐
                          │   Frontend — Next.js (apps/web)   │
                          │   • SSR/SSG marketing pages        │
                          │   • Client-rendered app screens    │
                          └───────┬────────────────┬──────────┘
                        REST (JWT bearer)      WebSocket (chat)
                                  ▼                    ▼
                          ┌──────────────────────────────────┐
                          │      API — NestJS (apps/api)       │
                          │  Auth · Users · Projects · Quotes  │
                          │  Matching · Messaging · Reviews    │
                          │  Notifications · Media · Admin     │
                          └───┬───────────┬───────────┬───────┘
                              │           │           │
                    Prisma ORM│   Signed  │   SDK/HTTP│
                              ▼   URLs    ▼           ▼
                    ┌──────────────┐ ┌──────────┐ ┌─────────────────────────┐
                    │  PostgreSQL   │ │  Storage  │ │   External Services      │
                    │ (Neon / RDS)  │ │ (R2 / S3) │ │ AI · Maps · Email/SMS ·  │
                    │               │ │           │ │ Analytics · (Payments)   │
                    └──────────────┘ └──────────┘ └─────────────────────────┘
```

**How each hop communicates:**
- **Browser → Frontend**: standard HTTPS page loads; Next.js serves server-rendered marketing pages directly and hydrates client components for the authenticated app.
- **Frontend → API**: REST over HTTPS, versioned (`/api/v1`), authenticated via a short-lived JWT sent as `Authorization: Bearer`, refreshed via an httpOnly cookie (full reasoning: `04-authentication-and-roles.md`). Real-time messaging uses a persistent WebSocket connection to the same API process, not a separate service.
- **API → Database**: NestJS services never write raw SQL directly against production tables — all access goes through Prisma, which is what makes the shared-types guarantee in §2 hold end to end.
- **API → Storage**: the API does not proxy file bytes. It issues a presigned upload URL; the browser uploads directly to R2/S3; only the resulting object key is written back to Postgres. This keeps the API stateless and avoids unnecessary load on a hop that doesn't need to touch application logic.
- **API → External services**: every external dependency (AI provider, Maps, Twilio/Resend, analytics) sits behind an internal service interface within its owning NestJS module (`AiService`, `NotificationsService`, etc.) — nothing outside that module calls a vendor SDK directly. This is the mechanism that makes the "swap the AI provider later" and "add payments later" claims in §1 actually true rather than aspirational.

---

## 4. User Roles

| Role | Permissions |
|---|---|
| **Guest** (unauthenticated) | Browse public marketing pages and public contractor profiles/reviews (read-only). Can view aggregate trust/verification information. Cannot post a project, message anyone, or see any authenticated dashboard. Every meaningful action available to a guest terminates in a login/signup prompt. |
| **Homeowner** | Create, edit (pre-match), and view own projects; upload project media; receive and compare quotes on own projects; message contractors matched to own projects; leave a review only on a project of their own marked completed; manage own profile. Cannot see another homeowner's projects, another contractor's private data, or any admin tooling. |
| **Contractor** | Manage own business profile and portfolio; upload verification documents (license, insurance); view and accept/decline leads addressed to them; submit/edit own quotes against accepted leads; message the homeowner on a matched project; cannot see leads or quotes belonging to another contractor, and cannot receive leads at all until `verification_status = verified` (a second, access-relevant gate beyond the role check itself — detail in `04-authentication-and-roles.md` §6). |
| **Admin** | Full user management (view/suspend/reactivate homeowners and contractors); reviews and approves/rejects contractor verification documents; can manually create a contractor profile (bootstrap-supply flow from the product spec) and later hand it off to a claiming contractor; monitors lead flow, quality, and revenue dashboards; every admin action against another user's data is recorded to the audit log (`admin_audit_log`, per `02-database-schema.md`). No public registration path — admin accounts are provisioned directly, not self-served. |

No `brand` or other role exists at MVP — the product spec's Phase 2 brand accounts are explicitly out of scope per CLAUDE.md, and the role model is designed (single enum + profile-table pattern) so adding one later is additive, not a redesign (`06-future-scalability.md` §5).

---

## 5. Core MVP Modules — Ranked by Implementation Order

Ranked by dependency, not by product importance — each module unlocks the ability to build and test the next one.

1. **Auth & Roles** — nothing else can be built or tested without login, JWT issuance, and RBAC guards in place.
2. **User Profiles** (homeowner profile, contractor profile + document upload) — the identity layer every other domain object references.
3. **Contractor Verification (admin review flow)** — must exist before any contractor can legitimately receive a lead; sequencing this early also means the admin module isn't a last-minute bolt-on.
4. **Projects** (creation, editing, AI Project Assistant integration) — the core object the rest of the marketplace revolves around.
5. **Matching & Lead Distribution** — depends on both verified contractors (step 3) and published projects (step 4) existing.
6. **Quotes** — depends on leads existing to be quoted against.
7. **Messaging** — scoped to a project/quote relationship, so it depends on steps 4-6 being in place to have something to message about.
8. **Reviews** — depends on a project reaching a completed state, which depends on the full quote → hire lifecycle above.
9. **Notifications** — technically cross-cutting, sequenced here because it has nothing to notify about until steps 4-8 produce real events (new lead, new quote, new message).
10. **Admin Portal** (user management, lead/revenue dashboards) — built last among app modules because it's a management surface over data produced by everything above; building it earlier means building it against fake data.
11. **Marketing site** — architecturally independent of the app modules above (different app in the monorepo, no auth dependency) and can be built on a parallel track starting from day one rather than waiting on step 10 — called out separately because it's not gated by the app's dependency chain the way steps 1-10 are.

---

## 6. Database Modules (Domains — No Tables Yet)

Grouped by bounded context, matching the modules in §5. Full field-level schema already exists in `docs/architecture/02-database-schema.md`; this is the domain inventory only, as requested.

- **Users & Identity** (auth, sessions/refresh tokens)
- **Homeowner Profiles**
- **Contractor Profiles**
- **Contractor Verification / Documents**
- **Service Categories** (shared reference data)
- **Projects**
- **Project Media**
- **Leads** (matching engine output)
- **Quotes**
- **Conversations & Messages**
- **Reviews**
- **Notifications**
- **Admin Audit Log**

**Explicitly not built at MVP** (flagged, not omitted from planning, per CLAUDE.md's "do not build future enterprise features"): Wallet & Transactions, Subscriptions/Billing, Brand Profiles, Campaigns. These are designed as additive attachment points in `06-future-scalability.md` §5 so the MVP schema isn't redesigned when they're eventually built.

---

## 7. Development Roadmap

No `docs/roadmap.md` existed to read — this is the proposed one. Each milestone ships something independently testable before the next begins; the marketing site (M-Web) runs as a parallel track, not a dependency of the app milestones.

| Milestone | Scope | Independently testable as |
|---|---|---|
| **M0 — Foundation** | Monorepo scaffolding, CI (lint/typecheck/build), staging environment deployed, health-check endpoint, Prisma connected to a provisioned Postgres instance | Staging URL returns 200; CI blocks a PR with a type error |
| **M1 — Auth & Roles** | Register/login (email+password, Google OAuth, phone OTP), JWT issuance/refresh, RBAC guard | A homeowner, contractor, and admin account can each log in and are blocked from each other's role-gated routes |
| **M2 — Profiles & Verification** | Homeowner/contractor profile CRUD, document upload to storage, admin approval/rejection flow | A contractor uploads a license, an admin approves it, `verification_status` flips to `verified` |
| **M3 — Projects & AI Assistant** | Project creation/edit, media upload, AI Project Assistant generating structured scope + budget | A homeowner enters free text and receives a structured, editable scope-of-work card |
| **M4 — Matching & Leads** | Matching engine, lead creation on project publish, contractor accept/decline | Publishing a project creates leads for the top 3-5 matching verified contractors; a contractor can accept one |
| **M5 — Quotes** | Quote submission, side-by-side comparison view, accept/decline | A contractor submits a quote against an accepted lead; the homeowner sees it in a comparison view and accepts it |
| **M6 — Messaging** | Real-time chat scoped to an accepted quote/project | Two test accounts (one homeowner, one contractor) exchange messages in real time |
| **M7 — Reviews** | Review submission gated to completed projects, display on contractor profile | A review can only be submitted after project status = completed, and appears on the contractor's public profile |
| **M8 — Notifications** | Email/SMS fan-out on key events (new lead, new quote, new message) | Triggering each event produces the corresponding email/SMS in a test inbox |
| **M9 — Admin Portal** | User management, verification queue, lead/revenue dashboards | An admin can suspend a user, clear the verification queue, and view non-zero dashboard numbers against seeded data |
| **M10 — Hardening & Launch Readiness** | Error tracking (Sentry) wired end-to-end, backup/restore verified on the production database, basic load test of the project→match→quote path | A deliberately triggered error appears in Sentry; a restored backup contains expected data; the core flow holds under a modest concurrent load test |
| **M-Web — Marketing Site** (parallel track, starts at M0) | Public pages per `docs/marketing-site/` IA and wireframes, SEO fundamentals, contact form routing | Every page in the approved IA is live, passes basic Lighthouse/SEO checks, and the contact form routes correctly by audience |

---

## Architectural Risks & Decisions Needed Before Development Begins

- **ORM confirmation**: Prisma is recommended (§1) but not yet a team-ratified decision — worth confirming before M0, since migrating ORMs after schema/migrations exist is real rework.
- **Build-vs-buy on auth**: in-house Passport/JWT is recommended for the reasons in `04-authentication-and-roles.md`, but it is a genuine time-tradeoff against Auth0/Clerk — worth a deliberate go/no-go before M1, not a default-by-momentum decision.
- **AI provider and cost model**: no per-request cost ceiling or rate-limiting strategy has been defined yet for the AI Project Assistant/Proposal Drafting features. This needs a decision before M3 — an unbounded AI cost surface on a free-to-post homeowner flow is a real budget risk, not just an implementation detail.
- **Contractor license verification is not uniformly automatable**: not every US state exposes a queryable public license-verification API. The verification flow (M2) needs an explicit fallback (manual admin review) built in from the start rather than assumed away — this should be decided per-state before M2, not discovered during it.
- **Real-time messaging hosting compatibility**: WebSocket connections need to be confirmed as supported (not just HTTP request/response) on whichever of Railway/Render is chosen before M6 is built against it.
- **Payments/escrow timing is a trust-messaging dependency, not just a feature decision**: the marketing site already built (`docs/marketing-site/`) references a "Project Protection Program" framing indirectly through trust content. Whether escrow ships in MVP or Phase 2 should be explicitly decided now, because it affects what the live site can honestly claim.
- **Document handling compliance**: license, insurance, and (if implemented) background-check data likely carries state-specific handling requirements. Worth a legal review before contractor documents are collected in production, not after.
- **Manual contractor entry / claiming workflow**: the product spec calls for founder-added contractor profiles that a real contractor later "claims." The claiming mechanism (how a real contractor proves they're the entity behind a platform-added profile) needs to be specified before M2/M4 build around it — right now it's a stated feature with no defined verification mechanism of its own.
- **Currency/locale columns**: `02-database-schema.md` already includes `currency` on money fields for future international expansion. Worth explicitly ratifying that decision now, while the schema is greenfield, since retrofitting it after real transaction data exists is materially harder than deciding it once, up front.

---

This document is planning and architecture only — no code, components, or APIs were generated, per instruction. Holding here for approval before proceeding to the next phase.
