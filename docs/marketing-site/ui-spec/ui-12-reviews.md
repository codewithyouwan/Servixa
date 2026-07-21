# UI Specification — Reviews

Base layout: `wf-10-reviews.md`. Inherits global rules. This page's "Testimonials" section IS the page's main body, per the wireframe's own framing — treated below as the primary content area rather than one section among several.

## Hero
- `text-h1` + `text-body-lg`, `space-6` spacing (shorter hero, consistent with other non-primary-conversion pages like Trust & Safety and FAQ).

## Statistics (summary band)
- Standard stat-item component, positioned directly under the hero with only `space-5` gap (tighter than the usual `space-8`) — intentionally close to the hero so it reads as part of the page's introduction/context-setting rather than a separate section.

## Filter bar
- **Component**: 4 select/dropdown components in a single row (All, Category, City/State, Homeowner/Contractor voice, Rating — 5 total per the wireframe), using the standard select component spec from `ui-01-components.md`, but at a smaller height (40px vs. the standard 48px) since this is a dense utility control, not a primary form input.
- **Responsive**: wraps to 2 rows at tablet, becomes a single "Filters" button opening a slide-in panel at mobile (standard mobile filter pattern — 5 full-width dropdowns inline would consume too much vertical space before any actual review content appears on a small screen).
- **Accessibility**: each filter's current state is announced via `aria-live="polite"` on the results count ("Showing 24 of 340 reviews") so screen-reader users get feedback when a filter changes without needing to re-scan the whole grid.

## Testimonials — full grid (main content)
- **Component sizes**: standard testimonial-card component, 3-column grid at desktop/laptop, 2-column tablet, 1-column mobile — `space-7` gaps, per the standard card-grid rule.
- **Pagination**: "Load More" button (`btn-secondary`, default size, centered, `space-8` top margin) appends the next page of results rather than a numbered pagination control — appropriate for a review-browsing context where a visitor is scanning casually rather than needing to jump to a specific page number.
- **Accessibility**: newly-loaded cards after "Load More" receive focus management — focus moves to the first newly-loaded card's heading (or an inserted "24 more reviews loaded" live-region announcement) rather than silently appending content a screen-reader user wouldn't know arrived.

## Why Reviews Here Are Different (feature section)
- Standard single feature-section treatment (like the homepage's Problem/Solution intro pattern but as one block, not 3 cards) — `text-h2` + `text-body` + `btn-secondary` link out to Trust & Safety.

## Final CTA band
- Standard dual-button `ink-900` full-bleed spec.
