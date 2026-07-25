# Folder Structure — AI Construction Marketplace (MVP)

## 1. Repository strategy

A single monorepo (npm workspaces) holding both the Next.js frontend and the NestJS backend, plus one shared package for types/DTOs.

Why a monorepo instead of two separate repos:
- The stack rule requires strict type safety. A shared `packages/shared` package lets both apps import the same TypeScript interfaces (User, Project, Quote, etc.) so a backend change that alters a shape breaks the frontend build immediately instead of failing silently at runtime.
- MVP team is small. One repo means one PR, one CI pipeline, one versioning story — less process overhead than coordinating releases across repos.
- It stays easy to split later: each app already lives in its own workspace folder, so extracting `apps/api` into its own repo when the team grows is a `git filter-repo`, not a rewrite.

```
bestbuild/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   └── shared/               # Shared TS types, DTOs, enums, constants
├── docs/                     # Architecture & product docs (this set)
├── package.json               # workspace root
└── tsconfig.base.json
```

## 2. Frontend — `apps/web` (Next.js App Router)

Routes are grouped by role, mirroring the three user types (homeowner, contractor, admin) called out in CLAUDE.md. Route groups (parentheses) organize access without affecting the URL.

```
apps/web/
├── app/
│   ├── (marketing)/                # Public pages: landing, how-it-works, pricing
│   │   └── page.tsx
│   ├── (auth)/                     # Login, register, OTP verify, OAuth callback
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-otp/
│   ├── (homeowner)/
│   │   └── dashboard/
│   │       ├── projects/
│   │       │   ├── new/            # AI-assisted project intake
│   │       │   └── [projectId]/
│   │       │       ├── quotes/
│   │       │       └── messages/
│   │       └── contractors/        # Search & discovery
│   ├── (contractor)/
│   │   └── dashboard/
│   │       ├── leads/
│   │       ├── quotes/
│   │       ├── portfolio/
│   │       └── crm/
│   ├── (admin)/
│   │   └── dashboard/
│   │       ├── users/
│   │       ├── leads/
│   │       └── revenue/
│   ├── layout.tsx
│   └── api/                        # Next.js route handlers ONLY for BFF concerns
│                                    # (e.g. auth cookie exchange) — all business
│                                    # logic stays in the NestJS API, not here.
├── components/
│   ├── ui/                         # shadcn/ui primitives (button, input, dialog…)
│   ├── forms/
│   └── layout/
├── lib/
│   ├── api-client.ts                # typed fetch wrapper around the NestJS API
│   ├── auth/                        # session helpers, role guards
│   └── hooks/
├── styles/
│   └── globals.css
└── middleware.ts                     # route-level auth/role redirects
```

Design decision: Next.js API routes are intentionally kept thin (auth cookie handling only). All domain logic lives in NestJS so there is exactly one backend to reason about, test, and scale — avoiding duplicated business rules across two runtimes.

## 3. Backend — `apps/api` (NestJS)

One module per bounded context, matching the domains in the product spec (Homeowner Portal, Contractor Portal, Marketplace Engine, Communication Hub, Reviews, Admin).

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/              # @Roles(), @CurrentUser()
│   │   ├── guards/                  # JwtAuthGuard, RolesGuard
│   │   ├── filters/                 # Global exception filter
│   │   ├── interceptors/            # Response shaping, logging
│   │   └── pipes/                   # Validation pipe config
│   ├── config/                      # Env-driven config modules (typed)
│   ├── database/
│   │   ├── prisma.service.ts
│   │   └── migrations/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── homeowners/
│   │   ├── contractors/              # profile, verification, licensing
│   │   ├── projects/                 # project creation, AI scope generation
│   │   ├── quotes/
│   │   ├── matching/                 # AI matching + lead distribution
│   │   ├── messaging/
│   │   ├── reviews/
│   │   ├── notifications/            # email/SMS/push fan-out
│   │   ├── media/                    # upload handling (photos/videos/docs)
│   │   ├── ai/                       # provider-agnostic AI service facade
│   │   └── admin/
│   └── shared/                       # re-exports from packages/shared
└── test/                              # (per CLAUDE.md: no tests authored for MVP)
```

Each module follows the same internal shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/` (or Prisma schema references). This consistency is what keeps functions small and modules swappable — a new engineer can predict where anything lives without reading the whole codebase.

## 4. `packages/shared`

```
packages/shared/
├── types/           # Project, Quote, User, Role, ProjectStatus, etc.
├── dto/             # Zod or class-validator schemas shared for FE form validation
└── constants/        # Service categories, US states, enums
```

Design decision: enums like `ServiceCategory` or `ProjectStatus` are defined once here and consumed by both the Prisma schema (backend) and form validation (frontend), so a new service category is a one-line change instead of a search-and-replace across two codebases.
