# Design System — Tables

Every table in the system is a configuration of one underlying **DataTable** pattern, not five separately-built components — this keeps sort/filter/pagination/bulk-action behavior consistent everywhere a table appears, and is the direct implementation of the "reusable design system" the request asked for rather than one-off screens.

## Generic DataTable pattern
- **Header row**: `neutral-100`-tinted background (barely-there, matching the marketing site's restrained section-tint convention), 14px semibold `ink-900` column labels, sortable columns marked with a small up/down chevron pair that highlights the active sort direction.
- **Body rows**: 48px minimum height (comfortably exceeds the 44px touch-target guideline), 1px `neutral-300` divider between rows, no zebra-striping (flat, calm, matching the "no unnecessary decoration" visual language) — hover state adds a subtle `neutral-100` row background so the current row is easy to track without needing striping.
- **Selection column** (optional, only on tables that support bulk actions): a checkbox at the row's left edge; selecting any row reveals a contextual action bar above the table ("3 selected — Approve / Reject / Export"), per the "bulk actions over one-by-one editing" guidance — this replaces repeated per-row action clutter with a single, appears-when-needed bar.
- **Actions column**: right-aligned, Icon Buttons or a single overflow "⋯" menu when more than two actions exist per row, so the table doesn't visually widen every time a new row-level action gets added.
- **Empty state**: centered icon + one-line message + a relevant Primary action ("No projects yet — Post your first project"), never a bare blank table.
- **Loading state**: skeleton rows (gray rounded rectangles matching each column's approximate content width) rather than a spinner overlay — preserves the table's shape so the layout doesn't jump once data arrives.
- **Responsive**: below `tablet`, the table does not force horizontal scroll for its own sake — each row instead collapses into a stacked card showing the same fields label-over-value, since an admin/dashboard table viewed on a phone is a real, if secondary, use case worth a proper mobile layout rather than a scroll-hint band.

## Projects Table
**Columns**: Title, Category (Tag), Status (Status Badge), Budget range, Quotes received (count), Created date, Actions.
**Contexts**: homeowner's own project history (no selection column, no bulk actions — a homeowner manages a handful of projects, not batches of them); admin's oversight view (adds selection column + bulk actions, plus a Homeowner column identifying whose project it is).

## Contractor Table
**Columns**: Avatar + Business name, Verification Badge, Service categories (Tags, truncated to 2 + "+N"), Trust Score, Status (Active/Suspended), Joined date, Actions.
**Context**: admin only. Selection column enabled for bulk status changes.

## Reviews Table
**Columns**: Reviewer (Avatar + name), Contractor reviewed, Rating (star row, compact), Excerpt of review body (truncated to ~60 characters), Moderation Status Badge, Date, Actions (Approve/Remove via overflow menu).
**Context**: admin moderation queue.

## Leads Table (mini-CRM pipeline view — alternative to the kanban-card presentation in `ds-02-cards.md`)
**Columns**: Project title, Match score, Status (Sent/Viewed/Accepted/Declined/Expired), Time since sent, Actions.
**Context**: contractor's lead management — offered as a denser, list-style alternative to the Lead Card board for contractors who prefer scanning a table over a kanban view; both read from the same underlying data, so this is a view toggle, not two separate features.

## Users Table
**Columns**: Avatar + name, Role (Homeowner/Contractor/Admin, as a plain-text column rather than a colored badge, since role isn't a status that needs color-coded urgency the way verification/project status does), Status (Active/Suspended), Joined date, Actions.
**Context**: admin only, filterable by role via the shared Filter Bar (`ds-07-search-pagination-filters.md`).
