# Application Design System — Component Inventory

This is the reusable component library for the product application (homeowner, contractor, and admin authenticated screens) — distinct from, but visually consistent with, the public marketing site's system in `docs/marketing-site/ui-spec/`. Every component below shares the same foundational tokens (`ui-00-design-tokens.md`: Inter type scale, 8px spacing scale, the near-monochrome + single-indigo-accent palette, 12px/20px radii, soft diffuse shadows) established for this project's Linear/Stripe/Vercel-style visual direction. No new tokens are introduced here — only new component types the marketing site never needed (data tables, an authenticated app shell, destructive actions).

The list is scoped to MVP, matching the ranked modules in `docs/architecture/07-mvp-technical-foundation-and-roadmap.md` §5 — nothing here supports a Phase 2+ feature (wallet, brands, campaigns) per CLAUDE.md's "do not build future enterprise features" rule.

## Buttons
- Primary Button
- Secondary/Outline Button
- Danger Button — new relative to the marketing site; used for destructive actions (decline a lead, delete a project, suspend a user)
- Ghost/Text Button
- Icon Button (always paired with an `aria-label`, per the accessibility rule carried over from the marketing site's UI spec)

## Badges, Avatars, Tags, Chips
- Verification Badge (Verified / Pending / Rejected — contractor status)
- Trust Score Badge (compact numeric/tier indicator)
- Status Badge (generic: project status, lead status, quote status — color-coded via semantic tokens, not raw hex)
- Avatar (homeowner/contractor profile photo, with initials-fallback state)
- Avatar Group (stacked, for "3 contractors matched" type displays)
- Tag (service category label — Kitchen, Roofing, HVAC, etc.)
- Chip (removable — used in multi-select filters, e.g. selected categories on a search screen)

## Cards
- Project Card (homeowner's project list, contractor's lead list)
- Contractor Card (search/discovery results, admin directory)
- Quote Card (comparison view)
- Lead Card (contractor's incoming-lead queue — distinct from Quote Card per the lead/quote separation in `docs/architecture/02-database-schema.md`)
- Review Card (shared with the marketing site's testimonial card, extended with moderation-state fields for admin)
- Notification Card / List Item

## Forms
- Project Form (create/edit — homeowner)
- Profile Form (homeowner profile; contractor business profile — two variants, shared shell)
- Contractor Verification Upload Form (license/insurance document upload — distinct from Profile Form since it has its own review-state lifecycle)
- Quote Form (contractor submission)
- Auth Forms (login, register, OTP verify, password reset) — shared shell across all three
- Review Form (homeowner, post-completion)
- Message Composer (text + attachment, used inside the messaging thread)

## Tables
- Projects Table (homeowner's project history; admin's project oversight)
- Contractor Table (admin directory/management view)
- Reviews Table (admin moderation queue)
- Leads Table (contractor's lead pipeline — mini-CRM view per the product spec)
- Users Table (admin — homeowners + contractors, filterable by role)
- Generic DataTable pattern underlying all five above (see `ds-05-tables.md`)

## Navigation
- Sidebar (primary authenticated-app navigation, role-aware: homeowner/contractor/admin each see a different item set)
- Navbar (top bar within the authenticated shell — distinct from the marketing site's public navbar; carries account menu, notifications bell, not marketing links)
- Breadcrumb (used on nested admin screens — e.g. Admin > Contractors > [Name] > Documents)
- Tabs (reused from the marketing site's tab component — e.g. a project's Overview/Quotes/Messages tabs)

## Dialogs
- Confirmation Modal (generic "are you sure" — accept a quote, submit a review)
- Delete Modal (destructive-specific variant of the above, always paired with a Danger Button)
- Document Preview Modal (admin reviewing an uploaded license/insurance file)

## Notifications
- Toast (transient, e.g. "Quote submitted")
- Alert / Banner (persistent, page-level — e.g. "Your account is pending verification")
- Notification Bell + Dropdown (navbar-anchored list of recent notifications)

## Search, Pagination, Filters
- Search Input (contractor discovery, admin user search)
- Pagination (cursor-based, matching the API architecture's pagination convention in `docs/architecture/03-api-architecture.md`)
- Filter Bar / Filter Panel (category, location, rating, status — reused pattern across Projects Table, Contractor Table, Reviews Table)

## Explicitly out of scope for this inventory (per CLAUDE.md)
No wallet/credits components, no brand-profile components, no campaign-management components, no subscription/billing UI beyond what a future Pricing-tier gate might need — these are Phase 2+ per the product spec and the architecture docs' future-scalability notes, and building their components now would be exactly the "unnecessary" work CLAUDE.md rules out.
