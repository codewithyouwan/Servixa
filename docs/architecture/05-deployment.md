# Deployment — AI Construction Marketplace (MVP)

CLAUDE.md leaves Storage, Payments, Maps, and AI provider blank. This document proposes concrete choices for the pieces deployment depends on, and explains the reasoning — all are swappable later since the API architecture keeps each behind its own module/service interface.

## 1. Frontend hosting: Vercel

Next.js is built by Vercel and deploys there with zero config — image optimization, edge caching, and preview deployments per PR work out of the box. For an MVP, avoiding a custom build/CDN setup is time better spent on product. Alternative (self-hosted on the same infra as the API) is viable later if cost or data-residency requirements change.

## 2. Backend hosting: Railway or Render (containerized NestJS)

Recommendation over AWS ECS/Fargate for the MVP stage specifically: both give a straightforward path from `git push` to a running container with managed Postgres, env var management, and log viewing, without needing to hand-build VPC/ECS/ALB configuration first. That configuration isn't wasted effort later — it's just not the right MVP-stage investment when the team's priority (per CLAUDE.md) is a simple, working MVP. `06-future-scalability.md` covers the migration path to AWS/GCP once traffic or compliance needs justify the added operational surface.

- NestJS app is packaged as a Docker image (single `Dockerfile`, multi-stage build: install → build → slim runtime image).
- Health check endpoint (`GET /health`) required by the platform's load balancer to detect a broken deploy before routing traffic to it.

## 3. Database: managed Postgres (Neon or RDS)

- **Neon**: recommended for MVP — serverless Postgres with instant branching, meaning a full copy of the schema (not the data) can be spun up per PR/staging environment cheaply. Good fit for a fast-iterating MVP.
- **RDS**: the fallback if the team anticipates needing AWS-native tooling (IAM auth, VPC peering with other AWS services) sooner rather than later.
- Either way: automated daily backups (provider-managed) plus point-in-time recovery enabled from day one — this is cheap insurance, not a future feature, given the platform holds contractor licensing/insurance documents and payment-adjacent data.

## 4. Object storage: Cloudflare R2 (or AWS S3)

Project photos/videos, portfolio galleries, and contractor license/insurance uploads need blob storage, not database rows (see `02-database-schema.md` §5). R2 is recommended over S3 specifically for egress cost — a marketplace with portfolio galleries and project photo uploads will generate meaningful bandwidth once it has real usage, and R2 has no egress fees. Both work identically from the NestJS `media` module through the S3-compatible API, so this is a low-risk choice to revisit later.

Uploads are signed-URL based: the client requests a presigned upload URL from `POST /media/presign`, uploads directly to storage, and only the resulting key is sent to the API — the NestJS server never proxies file bytes, which keeps the backend stateless and avoids unnecessary load.

## 5. Third-party services

| Concern | Recommendation | Why |
|---|---|---|
| Transactional email | Resend or Postmark | Simple API, good deliverability for verification/quote/lead emails |
| SMS/OTP | Twilio | Industry standard, needed for the OTP login flow and SMS notifications |
| Maps/geocoding | Google Maps Platform (Geocoding + Places Autocomplete) | US-only MVP; homeowners/contractors expect familiar address autocomplete. Mapbox is a cheaper alternative worth revisiting once volume drives cost |
| AI provider | Abstracted behind `AiService` interface (see API doc) — Anthropic Claude is a strong fit for the structured-scope-generation and proposal-drafting use cases described in the product spec | Provider is not hard-wired into business logic, so this is a configuration choice, not an architectural one |
| Payments | Not built for MVP core flows (no transaction in the core homeowner→contractor→quote loop requires it). Stripe is the recommended provider *when* wallet/escrow work begins, since it covers cards, ACH, and Apple/Google Pay in one integration | Per CLAUDE.md, wallet/escrow are Phase 2 monetization features, not MVP-core |
| Error tracking | Sentry (frontend + backend) | Minimal setup, catches production errors without building internal tooling |

## 6. Environments

Three environments: `development` (local), `staging` (auto-deployed from `main`, used for QA before release), `production` (deployed via manual promotion or tag). Each environment gets its own database instance (Neon branch or separate RDS instance) — staging never touches production data, given the sensitivity of contractor verification documents.

## 7. CI/CD (GitHub Actions)

Pipeline stages on every PR: install → lint → typecheck → build (both apps). Per CLAUDE.md, no automated test suite is authored for MVP, so the pipeline's job is to catch type errors and build failures, not run tests. On merge to `main`: run Prisma migrations against staging, then deploy both apps to staging automatically; production deploy is a manual approval step, given the cost of a bad deploy affecting live contractor/homeowner data.

## 8. Secrets management

Environment variables (DB connection string, JWT secrets, third-party API keys) are managed through the hosting platform's built-in secret store (Railway/Render/Vercel env vars), not committed to the repo. A `.env.example` in each app documents required variables without values.

## 9. Observability (minimal, MVP-appropriate)

- Structured request logging (NestJS logger with request ID correlation) shipped to the hosting platform's log viewer — no dedicated log aggregation service yet.
- `GET /health` endpoint checked by an uptime monitor (e.g. Better Uptime) for basic availability alerting.
- Sentry for error-level alerting.

Anything beyond this (metrics dashboards, distributed tracing, APM) is deferred — it solves problems an MVP with modest traffic doesn't have yet, and is covered as a growth-stage addition in `06-future-scalability.md`.
