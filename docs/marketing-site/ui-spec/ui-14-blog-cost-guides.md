# UI Specification — Blog / Cost Guide Hub

Base layout: `wf-12-blog-cost-guides.md`. Inherits global rules. This spec covers the hub/index page; the individual article/guide template is a separate, lighter page not detailed here (per the earlier wireframe scoping decision).

## Hero + Search
- `text-h1`, `text-body-lg` subtext, search input identical component/spec to the FAQ page's search.

## Category filter bar
- **Component**: a horizontal row of pill/badge-style filter buttons (not a dropdown — browsing by category benefits from all options being visible and one-tap, unlike the Reviews page's denser 5-filter set which justified a dropdown). Each pill: standard badge component sizing but interactive (acts as a toggle button), active state = `ink-900` background/`white` text, inactive = `white` background/`ink-900` text/1px `neutral-300` border.
- **Responsive**: horizontally scrollable row (not wrapping) at `tablet`/`mobile`, with a fade-edge affordance on the right to signal more categories exist off-screen.

## Featured guide (large card)
- **Component**: a unique, larger card variant — image left (or top on mobile), text right, single card spanning close to the full 1200px container width, `radius-lg` (the large-card radius token, distinct from the standard `radius-md` used by grid cards, since this card is deliberately meant to read as a different tier of content).
- **Typography**: `text-h2` headline (larger than the grid cards' `text-h3`), `text-body` description.

## Guide/article grid (main content)
- Standard content-card component from `ui-01-components.md`, 3-column grid, `space-7` gaps, standard responsive collapse (3→2→1 columns).
- **Pagination**: "Load More" button, same spec as the Reviews page.

## Browse by Project Type
- Identical component/spec to the Homeowners page's category icon grid (`ui-04-homeowners.md`) — same component reused, not redesigned, since it's functionally the same SEO-internal-linking grid appearing in a second context.

## Testimonials
- Standard testimonial-card component, 2-up, "the guide helped me" framing.

## Statistics
- Standard stat-item component, 3 items.

## Final CTA band
- Standard dual-button `ink-900` full-bleed spec, headline "Ready to Get Quotes for Your Project?"

## Page-specific accessibility note
- Category filter pills must expose their active/inactive state to assistive technology via `aria-pressed` (they're toggle buttons filtering the grid below, not navigation links to a new page — this distinction matters for correct ARIA role selection, since a filter pill should not be marked up as a link if it doesn't navigate to a new URL).
