# UI Specification — How It Works

Base layout: `wf-08-how-it-works.md`. Inherits global rules.

## Hero + Tabs
- **Spacing**: `space-8` above/below hero content, `text-h1` headline (not `text-display` — this is a supporting/resource page, not a primary conversion hero).
- **Component**: tabs component from `ui-01-components.md` ("For Homeowners" / "For Contractors"), positioned directly below the subtext, `space-6` gap above the tab row.
- **Accessibility**: implemented as the standard ARIA tabs pattern — `role="tablist"`, each tab `role="tab"` with `aria-selected`, each panel `role="tabpanel"` linked via `aria-labelledby`/`aria-controls`; arrow-key navigation between tabs is expected keyboard behavior for this pattern, not just click/tap.

## Homeowner Flow / Contractor Flow (tab panels)
- **Component**: 4-step stepper (one more step than the Home/Homeowners page's 3-step version, since this page's flow includes the AI-scope-building step as its own explicit stage) — same stepper component, extended to 4 items, `space-6` gaps between steps at desktop (slightly tighter than the 3-item version's `space-7`, to keep 4 items comfortably fitting the 1200px container without crowding).
- **Typography**: each step gets a full `text-body` paragraph (not just `text-body-sm`), consistent with the "expanded" stepper treatment used on the Homeowners/Contractors pages.
- Only the active tab's panel is rendered visibly (the inactive panel in the wireframe is shown for documentation completeness only, per its own annotation — at implementation, `display:none`/unmounted for the inactive tab, not just visually hidden with `opacity`).

## Behind the Scenes
- 2-card grid (AI Matching Engine, Verification), same feature-card component as other pages, `icon-lg` icons.

## Testimonials
- Standard testimonial-card component, 2-up, process-focused copy.

## Statistics
- Standard stat-item component, 3 items.

## Final CTA band
- Same dual-button, `ink-900` full-bleed spec as Home's.

## Page-specific responsive note
- The 4-step stepper (more content-dense than the 3-step versions elsewhere) is the first candidate to consider a 2×2 grid at `tablet` rather than a single vertical stack, if a strict vertical stack of 4 detailed steps (each with a full paragraph) creates excessive scroll length — this is a judgment call left to visual QA during implementation, not a hard rule, since it depends on final copy length.
