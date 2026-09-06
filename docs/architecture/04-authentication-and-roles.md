> **Superseded (Aug 2026):** the mechanics below (NestJS `@nestjs/passport`,
> self-issued JWTs, a `refresh_tokens` table) were written before the
> backend moved to FastAPI and were never built. The actual auth system
> is AWS Cognito — see `08-aws-mvp-setup-guide.md` and the "Servixa AWS
> Blueprint" artifact. §5 (RBAC/role model) and §6 (contractor
> verification state machine) below are still accurate in spirit —
> Cognito Groups now play the role that "single enum column" describes.

# Authentication & User Roles — AI Construction Marketplace (MVP)

CLAUDE.md leaves "Authentication" blank in the tech stack — this document proposes and justifies a concrete choice rather than leaving it open, since auth touches every other module.

## 1. Supported sign-in methods

Per the product spec's Homeowner Portal requirements: email/password, Google OAuth, and mobile OTP. Contractors and admins use email/password + Google OAuth (OTP is a homeowner-conversion-focused convenience feature, not needed for the smaller contractor/admin populations).

## 2. Recommended approach: NestJS Passport + JWT (access + refresh)

- **Library**: `@nestjs/passport` with strategies — `passport-local` (email/password), `passport-jwt` (session validation), `passport-google-oauth20` (Google), and a custom strategy for OTP verification.
- **Why not a third-party auth-as-a-service (Auth0/Clerk/Supabase Auth)**: they're reasonable options and would reduce initial build time, but this platform has three distinct roles with different verification requirements (contractor KYC is a multi-step, admin-reviewed workflow — not a standard auth provider feature) and role data lives directly alongside domain data (`contractor_profiles`, `homeowner_profiles`). Rolling auth in NestJS keeps the `users` table as the single source of truth without syncing state against an external identity system. This is a judgment call, not a hard constraint — if the team wants to move faster pre-launch, Auth0/Clerk remain a valid substitute for the password/OAuth/OTP mechanics described below, with role and profile data still living in this schema.
- **Tokens**: short-lived access token (~15 min, JWT, holds `userId` + `role`) and a longer-lived refresh token (~30 days, opaque random string, stored hashed in a `refresh_tokens` table so it can be revoked on logout/suspension — a bare JWT refresh token can't be revoked without this).
- **Storage on the frontend**: refresh token in an `httpOnly`, `Secure`, `SameSite=Lax` cookie (never reachable by JS, mitigating XSS token theft); access token held in memory (a JS variable/React context, not `localStorage`) and attached as `Authorization: Bearer` on API calls. This is the standard mitigation for the two main token-theft vectors (XSS reads localStorage; CSRF can't read an httpOnly cookie's value, and `SameSite=Lax` blocks it from being sent cross-site on state-changing requests).

## 3. OTP flow

1. `POST /auth/otp/request` — rate-limited per phone number (e.g. 3/hour) to prevent SMS-bombing abuse; generates a 6-digit code, stores a hash + expiry (5 min) server-side, sends via SMS provider (see `05-deployment.md`).
2. `POST /auth/otp/verify` — compares hash, issues token pair on match, marks `phone_verified_at`.

## 4. Google OAuth flow

Standard authorization-code flow via `passport-google-oauth20`. On first login, a `users` row is created with `auth_provider = google` and no `password_hash`; if an account with the same email already exists via password signup, the accounts are linked by email match (with a confirmation step) rather than silently merged, to avoid account-takeover via an unverified email claim.

## 5. Role model (RBAC)

Three roles, stored as a single enum column on `users.role`: `homeowner`, `contractor`, `admin`. Deliberately flat — no permissions table, no role hierarchy — because the MVP has exactly three fixed roles with non-overlapping capabilities. A generic permissions system would be exactly the kind of "future enterprise feature" CLAUDE.md says not to build; if a fourth role (e.g. brand accounts) is introduced in Phase 2, it's a new enum value and a new guard check, not a schema migration.

- **Enforcement**: `@Roles('admin')` decorator + a `RolesGuard` that reads `request.user.role` (set by `JwtAuthGuard` from the validated token) and rejects with 403 if it doesn't match. Applied at the controller-method level, not scattered through service logic, so every endpoint's access requirement is visible by reading its decorators.
- **Ownership checks are separate from role checks**: role answers "can a contractor hit this endpoint at all"; a second check in the service layer answers "is this contractor the owner of this specific quote/lead" (e.g. `quote.contractorId === currentUser.contractorProfileId`). Conflating the two would let one contractor edit another's quote as long as both are contractors.

## 6. Contractor verification state machine

Distinct from login/auth, but access-relevant: a contractor can log in and browse immediately after signup, but can't receive leads until verified.

```
unverified → pending (documents uploaded) → verified (admin approved)
                                          → rejected (admin rejected, can resubmit → pending)
```

Enforced via a guard on lead/quote-related endpoints checking `contractor_profiles.verification_status = verified`, separate from the `RolesGuard`. This lets "browse the platform" and "transact on the platform" have different gates, matching the product spec's emphasis on trust as a data-driven, verified signal rather than self-reported.

## 7. Admin accounts

No public registration path — admin `users` rows are created directly (seed script / existing-admin invite), never via `/auth/register`. This is the simplest safe default for an MVP with a handful of internal admins; an invite-flow UI is a Phase 2+ addition once the admin team grows beyond people with direct database/CLI access.
