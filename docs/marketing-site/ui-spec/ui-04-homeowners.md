# UI Specification — For Homeowners

Base layout: `wf-02-homeowners.md`. Inherits all global rules from `ui-00`/`ui-01`/`ui-02`; this spec notes deltas from the Home page pattern (`ui-03-home.md`) rather than repeating identical sections in full.

## Hero
- Same structure/spacing/typography as the Home hero, with two differences: (1) only `btn-primary` "Post Your Project Free →" is shown — no secondary button, since this is an audience-locked page and a contractor CTA here would compete with the page's single purpose; (2) the hero image is a single real photo (kitchen or bathroom reno) with no floating UI card overlay, since the AI-assistant proof point belongs to the AI Features page, not repeated here.
- **Accessibility**: `<h1>` = this page's headline, distinct from Home's — each page has exactly one, unique `h1`.

## Why Homeowners Choose Us
- 4-card grid (not 3) — same feature-card component as Home's Problem/Solution section, `icon-lg` icons, `text-h3` + `text-body-sm`. Grid: 4-col desktop → 2-col tablet → 1-col mobile (matches the AI Spotlight grid's 4-item exception noted in `ui-03-home.md`).

## How It Works (expanded)
- Same stepper component as Home, but each step includes an additional `text-body` paragraph (not just `text-body-sm`) beneath the step label — this page's visitor is further into consideration and the spec calls for expanded detail here specifically. Extra vertical space per step: `space-4` between label and paragraph.
- Mid-page CTA: `btn-primary`, default (48px) size, centered under the stepper.

## What You Can Build/Fix (category grid)
- **Component sizes**: icon grid, 10 items, each an icon (`icon-lg`) + `text-body-sm` label stacked vertically, centered, in a 5-column grid at desktop (2 rows of 5), collapsing to a 3-column grid at tablet, 2-column at mobile.
- **Interaction**: each item is a link (to `/guides/[category]`) — treated as a card-level hover per the feature-card hover spec (border → `ink-900`), even though visually minimal.
- **Accessibility**: this is a navigation-like grid; mark up as a `<nav>` landmark with `aria-label="Browse by project type"` distinct from the main site nav, so screen-reader users can distinguish it.

## Trust section (condensed)
- Single-row badge strip (3 items), same visual treatment as Home's trust bar (icon + label, `neutral-100` background band), `space-8` above/below.

## Testimonials — homeowner-filtered
- Same testimonial-card component as Home, 2-up grid (not 3) since only 2 are specified in the wireframe — grid still responds per the standard card-grid rules if more are added later.

## Statistics
- Same stat-item component as Home. 3 items here (vs. Home's 4) — spacing/sizing identical, just fewer items, centered.

## FAQ (accordion preview)
- **Component**: standard accordion component from `ui-01-components.md`, showing 4 items only (not the full FAQ set) — "See All FAQs →" link (`btn-secondary` styling or a plain text-link, centered, `space-6` below the last accordion item) leads to the full `/faq` page.
- **Accessibility**: each accordion trigger is a real `<button>` with `aria-expanded` state, controlling a panel referenced via `aria-controls` — standard disclosure pattern, consistent across every page that uses an accordion (this page, FAQ, Pricing, Trust & Safety).

## Final CTA band
- Identical spec to Home's final CTA band, single `btn-primary` only (no secondary), headline/subtext swapped to this page's copy ("Post Your Project — It's Free").
