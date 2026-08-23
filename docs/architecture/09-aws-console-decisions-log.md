# AWS Console Setup — Decisions Log

A running record of every setting chosen while clicking through the AWS
console for the MVP setup (companion to `08-aws-mvp-setup-guide.md`).
Purpose: when something breaks later, or you want to change a setting,
check here first for what was picked and why, instead of re-deriving it
or guessing what the console defaulted to.

Updated as we go — pending items are marked so it's clear what's tracked
vs. not reached yet.

## Cognito User Pool (`servixa-mvp`)

### Application type — "Define your application"

| Setting | Chosen | Why |
|---|---|---|
| App type | **Traditional web application** | The other three are wrong for us: Machine-to-machine is for service accounts with no human users (we have real people logging in); Single-page app and Mobile app both default to a *public* client (no client secret) since browser/mobile code can't hold a secret safely. Our FastAPI backend is the only thing that talks to Cognito and it can safely hold a secret — "traditional web app" is the closest match to that shape, even though the actual frontend is Next.js. |
| Return URL | Placeholder (`http://localhost:3000/callback`) | Required by the wizard because it's built around Cognito's hosted login page, which we don't use — the backend logs users in directly via `USER_PASSWORD_AUTH`, not an OAuth redirect. This field is effectively unused. |

### Configure options screen

| Setting | Chosen | Why |
|---|---|---|
| Sign-in identifiers | **Email only** (Phone number and Username unchecked) | MVP is email/password only — no phone-based OTP flow, per `04-authentication-and-roles.md`. Keeping it to one identifier avoids extra complexity with nothing gained yet. |
| Self-registration | **Enabled** | Homeowners/contractors/brands need to sign themselves up via `POST /auth/register`. If left off, only admin-created accounts would be possible and the public sign-up call would fail outright. (Admins are still created the locked-down way regardless of this setting — see `08-aws-mvp-setup-guide.md` §4.) |
| Required attributes | **email**, **name** | `email` is required by the sign-in identifier choice. `name` is required because `POST /auth/register` always sends a `name` value (see `app/shared/routers/auth.py`'s `RegisterRequest`). Everything else (address, phone, birthdate, etc.) left unchecked — dead fields nobody would fill in at this stage. |

### Password policy — _pending_
### MFA — _pending_ (plan: off/optional for MVP, revisit later)
### Email delivery — _pending_ (plan: Cognito's built-in sender, ~50/day cap, fine for testing)
### App client / client secret / auth flows — _pending_ (critical: needs "Generate a client secret" + `ALLOW_USER_PASSWORD_AUTH` + `ALLOW_REFRESH_TOKEN_AUTH` — see note in §2 of the setup guide about the quick-wizard possibly defaulting these off)
### Groups — _pending_ (plan: `homeowner`, `service_provider`, `brand`, `admin` — exact spelling, case-sensitive)

## RDS — _not started_

## Budgets (`servixa-mvp` account)

| Setting | Chosen | Why |
|---|---|---|
| Zero-spend budget | Created, $1/month threshold | Tripwire so any unexpected charge emails immediately, while still on free tier + credits. Confirmed live via AWS CLI: `ActualSpend: $0.00` as of 2026-08-22. |
| Monthly cost budget (~$20-30) | _pending_ | Soft ceiling for once real charges start (mainly RDS). |
