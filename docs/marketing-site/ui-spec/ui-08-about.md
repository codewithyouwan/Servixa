# UI Specification — About

Base layout: `wf-06-about.md`. Inherits global rules.

## Hero
- **Spacing/typography**: `text-eyebrow` "About Us" → `text-display` headline → `text-body-lg` subtext, same rhythm as Home's hero but no buttons in the hero itself (this page's hero is mission-framing, not a conversion moment — CTAs arrive at the end).
- **Height target**: ~480px, no image required in the hero band itself.

## The Problem We're Solving
- **Layout**: text block (max-width ~640px) alongside a supporting image on the right (founder/team photo or an illustrative visual), 55/45 split at desktop, stacking at tablet/mobile per the standard text-first stacking rule.
- **Typography**: `text-h2` + `text-body` narrative paragraph (this is the one section on the site with the longest continuous prose block — line-length constrained to the ~640px column specifically to keep it readable).

## Our Approach
- 4-card grid, same feature-card component as other pages, `icon-lg` icons, short `text-h3` labels — no body-text description needed per card (the wireframe shows these as short statement cards, so card padding can be tighter, `space-4` instead of `space-5`, since content is minimal).

## Roadmap/Vision teaser
- **Component**: a horizontal 5-stage marker — visually similar to the stepper component but non-interactive and intentionally lighter-weight (no numbered circles matching the "how it works" stepper's exact style, to avoid implying this is an actionable, clickable process the way "how it works" is). Use small `text-body-sm` labels under simple dot markers (8px circles, `neutral-300` fill, connected by a 1px line) rather than the bold numbered-badge treatment used elsewhere.
- **Accessibility**: marked up as a plain list, not an `<ol>` implying sequential user steps (since this is a company roadmap, not a user task sequence) — `<ul>` with `aria-label="Company roadmap"`.

## Team (conditional section)
- If included: standard testimonial-card-like layout but repurposed for team bios — photo (80px circle) + name (`text-h3`) + title (`text-body-sm`, `neutral-500`). If omitted (per the wireframe's recommendation to skip rather than under-populate), no placeholder or "coming soon" text should render — the section is absent from the DOM entirely, not present-but-empty.

## Testimonials/Press mentions
- If using press logos instead of quotes: logo images grayscale-by-default (`filter: grayscale(100%)`, standard "as-seen-in" treatment), full-color on hover, `space-6` gaps, centered row, capped height 32px per logo to keep varying logo aspect ratios visually consistent.

## Statistics
- Standard stat-item component, company-scale framing (year founded, states served) rather than volume metrics — same component, different content per the wireframe's guidance.

## Final CTA band (4-button variant — unique to this page)
- **Spacing**: same `space-10`/full-bleed `ink-900` band as other pages' final CTA.
- **Component sizes**: 4 buttons in a single row at desktop (`btn-primary` × 2 for the standard dual CTA, `btn-secondary` × 2 for "Get in Touch" and "See Open Roles"), `space-4` gaps. This is the only final-CTA band on the site with 4 buttons — at `tablet` these wrap to a 2×2 grid, at `mobile` they stack to a single column, each full-width, `space-3` vertical gaps.
- **Hierarchy within 4 buttons**: even here, only the 2 primary buttons use `btn-primary` styling — "Get in Touch"/"See Open Roles" stay `btn-secondary` (white border/text on the dark band) so the visual hierarchy still reads correctly despite more buttons being present than anywhere else on the site.
