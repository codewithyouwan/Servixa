# Design System — Navigation (Sidebar, Navbar, Breadcrumb, Tabs)

The authenticated app uses a sidebar-plus-topbar shell, distinct from the marketing site's public navbar-and-footer layout — this is a standard, well-understood pattern for a role-differentiated dashboard product and keeps navigation predictable across three very different item sets (homeowner/contractor/admin) without inventing a new pattern per role.

## Sidebar
- **Width**: 240px expanded, collapsible to a 64px icon-only rail (a toggle at the sidebar's bottom edge). Background `white`, 1px `neutral-300` right-hand border separating it from the content area — no shadow, consistent with the flat-by-default elevation rule.
- **Structure**: logo/wordmark at the top (64px tall, matching the navbar's height so the two align), then a vertical list of nav items, each a 40px-tall row: 20px icon + 14px medium label, `neutral-700` at rest, `ink-900` with a `neutral-100` background pill (radius-sm) when active — **not** an `accent-600` fill, since reserving the accent for actionable buttons (not navigation state) keeps the "one accent, one meaning" rule intact even inside the app shell.
- **Role-aware item sets** (populated from the role stored on the authenticated user, per `docs/architecture/04-authentication-and-roles.md`):
  - *Homeowner*: Dashboard, My Projects, Messages, Reviews, Profile.
  - *Contractor*: Dashboard, Leads, Quotes, Portfolio, Messages, Profile.
  - *Admin*: Dashboard, Users, Contractors (verification queue), Reviews (moderation), Leads (monitoring), Revenue.
- **Bottom-anchored items**: Settings and Log Out sit in a separate group at the sidebar's bottom, visually separated from the main nav list by a 1px divider and slightly more muted (`neutral-500`) — these are utility actions, not primary navigation, and shouldn't compete visually with the role's main task list.
- **Collapsed state**: icons only, each wrapped in a tooltip on hover showing the label — never collapses to nothing-at-all, since an icon-only rail with no fallback label is a real accessibility and discoverability regression for anyone unfamiliar with the icon set.

## Navbar (in-app topbar)
- **Height**: 64px, `white` background, 1px `neutral-300` bottom border, sits to the right of the sidebar spanning the remaining width.
- **Left side**: a Breadcrumb (see below) or, on top-level pages, a plain 20px semibold page title.
- **Right side**: search icon button (opens a command-palette-style search overlay on larger screens, or a dedicated search page on mobile), the Notification Bell + Dropdown, and an Avatar-triggered account menu (Profile, Settings, Log Out) — in that order, matching the left-to-right priority of "find something" → "what needs my attention" → "who am I" that a returning user actually scans in.

## Breadcrumb
- Used only on screens nested more than one level deep (per the "3+ levels of depth" guideline — not on top-level dashboard pages, where it would add clutter with no navigational value). Example: `Admin  >  Contractors  >  Jane's Plumbing Co.  >  Documents`. Each segment except the last is a Ghost-style text link in `neutral-500`; the current/final segment is `ink-900`, not a link. A small `neutral-300` chevron separates segments.

## Tabs
- Reused directly from the marketing site's tab component (underline style, `accent-600` active indicator) — used within a single record's detail view, e.g. a project detail page's Overview / Quotes / Messages / Reviews tabs, or a contractor profile's Portfolio / Reviews / Documents tabs (admin view).

## Cross-cutting navigation rules
- **Keyboard/back-button behavior**: all in-app navigation uses real routes (not client-only view-state swaps that break the browser back button) — per the "predictable back button" guideline, a contractor who tabs into a lead's detail view and hits back should land exactly where they left the lead list, not at the dashboard root.
- **Skip link**: the authenticated shell includes the same skip-to-main-content pattern established on the marketing site, landing past the sidebar directly into the page's primary content region.
