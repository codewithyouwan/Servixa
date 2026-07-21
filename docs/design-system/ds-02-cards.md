# Design System — Cards

All cards share the base construction established on the marketing site: white fill, 1px `neutral-300` hairline border, `radius-md` (12px), no shadow at rest, `shadow-sm` + border darkening to `ink-900` on hover only when the card itself is a click target. App-context cards run tighter internal padding (16px, not the marketing site's 24px) since dashboard density matters more here.

## Project Card
**Used by**: homeowner's project list, contractor's lead queue (as the project summary within a Lead Card).
**Contents**: category `icon-md` + Tag (top-left), Status Badge (top-right), project title (16px semibold `ink-900`), one-line location + budget range (14px `neutral-700`), a small thumbnail from the project's first uploaded photo (48×48px, `radius-sm`, right-aligned) if present, and a footer row showing quote count ("3 quotes received") or lead status. Entire card is a click target routing to the project detail view.

## Contractor Card
**Used by**: contractor discovery/search results, admin directory.
**Contents**: Avatar (48px) top-left, business name (16px semibold) beside it, Verification Badge directly under the name, a star-rating row + review count (14px `neutral-700`), a row of up to 3 service-category Tags, and — distinct from the marketing site's public contractor profile — an admin-only variant that swaps the rating row for account status (Active/Suspended) and adds a small "Manage" Ghost Button in the card's footer.

## Quote Card
**Used by**: homeowner's quote comparison view.
**Contents**: Contractor Card summary (compact: avatar, name, Trust Score Badge) at the top, a prominent price (20px semibold `ink-900`), estimated timeline (14px `neutral-700`), a Status Badge, and two footer actions — a Primary "Accept Quote" button and a Ghost "Decline" button, laid out side by side so the comparison view's cards align consistently across a 2-3 column grid.

## Lead Card
**Used by**: contractor's incoming-lead queue — kept visually distinct from Quote Card per the lead/quote separation already established in `docs/architecture/02-database-schema.md` (a lead is "this project was shown to you," not yet a submitted quote).
**Contents**: a condensed Project Card at the top, a match-score indicator (small `accent-600` percentage or tier chip — "92% match"), a countdown/timestamp ("Received 2 hours ago"), and two footer actions: Primary "Accept Lead," Ghost "Decline." Once accepted, the card's footer swaps to a single "Submit Quote" Primary button, and the card visually moves from the "New" column to an "Accepted" column if the lead queue is presented as a simple kanban-style board (a reasonable MVP presentation of the "mini CRM" pipeline named in the product spec, without building a full drag-and-drop CRM).

## Review Card
**Used by**: contractor's public profile (shared directly with the marketing site's testimonial card — same component, no fork), and admin's moderation queue (extended variant).
**Admin variant additions**: a moderation Status Badge (Published/Flagged/Removed), and a footer row of Ghost actions ("Approve," "Remove") visible only in the admin context — achieved via a `mode="admin"` prop-level distinction on the same underlying component, not a separate component, so the core review-card visual never drifts between the two contexts.

## Notification Card / List Item
**Used by**: notification bell dropdown, and a full notifications page if one exists.
**Contents**: a small category icon (24px, colored by notification type — `accent-600` for "new lead," `green-600` for "quote accepted," `neutral-500` for general system notices), a one-line message (14px `ink-900` if unread / `neutral-700` if read), a relative timestamp (12px `neutral-500`), and an unread-state left border accent (2px `accent-600`) rather than a background-color change, which keeps the list scannable without every unread row fighting for attention via a filled background.
