# API Architecture — AI Construction Marketplace (MVP)

## 1. Style: REST, modular monolith

**REST over GraphQL.** The MVP has a small, well-known set of screens per role (homeowner dashboard, contractor dashboard, admin dashboard). GraphQL earns its complexity when clients need to compose many nested resources in ad hoc ways; here the data-fetching patterns are known upfront, so REST endpoints designed around those screens are simpler to build, cache, and reason about.

**Modular monolith over microservices.** One NestJS deployable, internally split into the modules listed in `01-folder-structure.md`, each with a clear boundary (its own service/controller/DTOs). This gives most of the maintainability benefit of microservices (no god-module, clear ownership) without the operational cost (service discovery, distributed tracing, network failure handling) that an MVP team doesn't need yet. `06-future-scalability.md` covers how specific modules (matching, AI, notifications) can be extracted into standalone services later without a rewrite, because they're already isolated behind service interfaces.

**Versioning**: all routes under `/api/v1/...`. Cheap to add now, expensive to retrofit once mobile clients exist.

## 2. Cross-cutting conventions

- **Validation**: every incoming request body is a DTO class validated by `class-validator` via NestJS's global `ValidationPipe`. Invalid requests never reach a service method.
- **Auth**: `JwtAuthGuard` applied globally; individual routes opt out with `@Public()`. Role checks use `@Roles('admin')` + `RolesGuard`. See `04-authentication-and-roles.md`.
- **Response shape**: a global interceptor wraps successful responses as `{ data, meta }` and a global exception filter normalizes errors as `{ error: { code, message } }` — one predictable shape for the frontend's typed API client to parse.
- **Pagination**: cursor-based (`?cursor=&limit=`) on all list endpoints (projects, leads, messages) — offset pagination degrades on the `messages` table specifically once conversations get long.
- **Idempotency**: mutation endpoints that can be double-submitted from the UI (quote submission, lead accept/decline) accept an `Idempotency-Key` header, checked against a short-lived cache.

## 3. Module → endpoint map

### `auth`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Email/password or phone signup |
| POST | `/auth/login` | public | Email/password login |
| POST | `/auth/otp/request` | public | Send OTP to phone |
| POST | `/auth/otp/verify` | public | Verify OTP, issue session |
| GET | `/auth/google/callback` | public | OAuth callback |
| POST | `/auth/refresh` | authenticated | Rotate access token |
| POST | `/auth/logout` | authenticated | Revoke refresh token |

### `users`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/users/me` | authenticated | Current profile (role-aware shape) |
| PATCH | `/users/me` | authenticated | Update profile |
| DELETE | `/users/me` | authenticated | Soft-delete account |

### `projects`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/projects` | homeowner | Create project (triggers AI scope generation) |
| GET | `/projects/:id` | homeowner (owner), contractor (if matched), admin | |
| PATCH | `/projects/:id` | homeowner (owner) | Edit before matching |
| POST | `/projects/:id/media` | homeowner (owner) | Attach photos/videos |
| GET | `/projects` | homeowner | List own projects |

### `contractors`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/contractors` | homeowner | Search/browse (category, location, rating filters) |
| GET | `/contractors/:id` | public | Public profile, portfolio, reviews |
| PATCH | `/contractors/me` | contractor | Update business profile |
| POST | `/contractors/me/documents` | contractor | Upload license/insurance |
| GET | `/contractors/me/portfolio` | contractor | |
| POST | `/contractors/me/portfolio` | contractor | Add project gallery item |

### `matching`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/projects/:id/match` | system (internal, triggered on project publish) | Runs AI matching, creates `leads` for top 3–5 contractors |
| GET | `/leads` | contractor | Contractor's incoming leads |
| POST | `/leads/:id/accept` | contractor | |
| POST | `/leads/:id/decline` | contractor | |

### `quotes`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/projects/:id/quotes` | contractor (with accepted lead) | Submit quote |
| GET | `/projects/:id/quotes` | homeowner (owner) | Side-by-side comparison view |
| PATCH | `/quotes/:id` | contractor (owner) | Edit before homeowner acceptance |
| POST | `/quotes/:id/accept` | homeowner | |
| POST | `/quotes/:id/decline` | homeowner | |

### `messaging`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/conversations` | homeowner, contractor | List own conversations |
| GET | `/conversations/:id/messages` | participant | Paginated history |
| POST | `/conversations/:id/messages` | participant | Send message (text or attachment); fanned out over WebSocket, see below |

### `reviews`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/projects/:id/reviews` | homeowner (owner, project completed) | |
| GET | `/contractors/:id/reviews` | public | |

### `ai`
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/ai/project-assistant` | homeowner | Turns free-text intake into structured scope + budget suggestion |
| POST | `/ai/proposal-draft` | contractor | Drafts a proposal/quote scope from project data |

This module is a thin controller in front of an internal `AiService` interface — see `06-future-scalability.md` for why the provider integration is isolated here.

### `admin`
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/admin/users` | admin | |
| PATCH | `/admin/users/:id/status` | admin | Suspend/reactivate |
| GET | `/admin/contractors/documents` | admin | Verification queue |
| POST | `/admin/contractors/documents/:id/review` | admin | Approve/reject |
| POST | `/admin/contractors` | admin | Manually create a contractor profile (bootstrap supply) |
| GET | `/admin/leads` | admin | Lead flow monitoring |
| GET | `/admin/revenue` | admin | Dashboard aggregates |

## 4. Real-time messaging

`messaging` is REST for history/pagination but live delivery uses a WebSocket gateway (NestJS `@WebSocketGateway`, Socket.IO adapter) scoped per conversation room. Chosen over polling because in-app chat is a named MVP feature and polling would add latency and unnecessary load for something users expect to feel instant. Notifications (email/SMS/push) piggyback on the same message-created event via an internal event emitter, not a separate polling job.

## 5. AI Project Assistant — request flow

1. Homeowner submits free-text description in `POST /ai/project-assistant`.
2. `ProjectsService` persists the draft project; `AiService` is called with project fields + any uploaded photos.
3. AI response (structured scope, suggested budget range, suggested category) is stored in `projects.ai_generated_scope` (jsonb) and returned to the client for the homeowner to review/edit before publishing.
4. Only on publish (`status: draft → open`) does `POST /projects/:id/match` fire, creating leads.

This keeps a clear boundary: AI assists drafting, but a human (the homeowner) confirms before the project enters the marketplace — important for lead quality, which the product spec calls out directly.
