# Design System — Search, Pagination, Filters

These three are shared utility components that attach to any list or table in the system (Projects Table, Contractor Table, Reviews Table, contractor discovery) rather than being rebuilt per screen.

## Search Input
- **Construction**: 40px tall, 1px `neutral-300` border, `radius-sm`, leading `neutral-500` search icon, placeholder text describing what's searchable in context ("Search by name or business..." rather than a bare "Search"). A small "×" clear button appears once text is entered.
- **Behavior**: debounced (≈300ms) live filtering for in-app lists rather than requiring an explicit submit — appropriate for authenticated, already-fast internal data, unlike the marketing site's search which could reasonably wait for a submit since it's querying a larger public catalog.
- **Command-palette variant** (navbar-triggered, optional MVP nicety): a centered modal-style search overlay (⌘K / Ctrl+K), same input construction, results grouped by type (Projects, Contractors, Users) beneath it — a genuine productivity nicety for an admin managing a growing dataset, not required for homeowner/contractor use but cheap to include once the base Search Input exists.

## Pagination
- **Style**: cursor-based (matching the API's cursor pagination convention in `docs/architecture/03-api-architecture.md`, not offset-based page numbers), presented to the user as a simple "Load More" button at the bottom of a card-grid or feed context (Leads board, notifications), or as Previous/Next controls with a "Showing 1-20 of 84" label for a strict tabular context (admin tables), where a user's mental model is closer to "flipping pages" than "loading more."
- **Construction (Previous/Next variant)**: two Ghost-style Icon Buttons (chevron-left, chevron-right) flanking the "Showing X-Y of Z" label, right-aligned beneath the table, both buttons disabled (not hidden) at the start/end of the result set so their position never shifts.

## Filters
- **Filter Bar** (compact, inline — used above Contractor Table, Reviews Table, Users Table): a horizontal row of small Select components (40px tall, matching the Search Input's height so the whole toolbar reads as one aligned unit), one per filterable dimension (Category, Status, Role, Date range), plus a "Clear filters" Ghost link that appears only once at least one filter is active.
- **Filter Panel** (expanded — used on contractor discovery, where there are more, richer filter dimensions than an admin table needs): a collapsible side panel or a "Filters" button that opens a popover, containing grouped controls (checkboxes for multi-select categories, a rating minimum slider, a location radius input) and applying via Chips (per `ds-01-buttons-badges-avatars.md`) that appear above the result list once selected — each Chip individually removable, plus one "Clear all" action.
- **Rule shared with the marketing site's Reviews page filter bar**: applying or changing a filter updates an `aria-live="polite"` region announcing the new result count, so a screen-reader user gets the same "filtered to 12 results" feedback a sighted user sees instantly in the list length.
