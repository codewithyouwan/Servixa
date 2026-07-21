# UI Specification — Home

Base layout: `wf-01-home.md`. Global rules (header/footer, buttons, cards, accessibility, responsive) inherit from `ui-00`, `ui-01`, `ui-02` — this spec covers page-specific application only.

## Hero
- **Spacing**: `space-10` (128px desktop / 48px mobile) above and below, per the framework's L-spacing rule for the page's most important section. Internal stack: eyebrow → `space-2` → `text-display` headline → `space-5` → `text-body-lg` subtext → `space-6` → button row.
- **Typography**: eyebrow = `text-eyebrow`, `accent-600` color (the one place an eyebrow uses the accent rather than plain ink, to mark the very first thing a visitor reads as intentional). Headline = `text-display`, `ink-900`. Subtext = `text-body-lg`, `neutral-700`.
- **Component sizes**: two buttons, hero-size (`56px` height) — `btn-primary` "Post Your Project Free →" then `btn-secondary` "I'm a Contractor →", `space-4` gap between them, both left-aligned under the text block (not centered — left alignment keeps the whole hero reading as one consistent left edge with the headline above it).
- **Images**: hero photo fills the right ~55% of the container at desktop (text block left ~45%), `radius-lg`, with the floating AI Assistant UI card (a small `shadow-lg` card, `radius-md`, `white` background, ~280px wide) overlapping the bottom-left corner of the photo by roughly half its height.
- **Responsive**: stacks per the framework (text first, image second) at `tablet` and below; floating UI card scales down to ~220px wide on `tablet`, and is hidden entirely on `mobile` (kept: just the photo) to avoid an overlapping-card layout collision on narrow viewports where it would need to cover too much of the image to remain legible.
- **Color**: background `white`. No section divider needed above (top of page) or below (trust bar sits directly under with only spacing, no rule line, keeping the hero-to-trust-bar transition soft).
- **Accessibility**: hero `<h1>` is this exact headline (the only `h1` on the page). Photo `alt` text describes the scene concretely ("Contractor installing kitchen cabinets"), not "hero image."

## Trust bar
- **Spacing**: `space-8` above/below. Internal: 4 items in a single row, `space-8` gap between each, vertically centered.
- **Typography**: `text-body-sm`, weight 600, `neutral-700`.
- **Component sizes**: icon (`icon-md`) + label inline, `space-2` gap.
- **Responsive**: wraps to a 2×2 grid at `tablet`, stacks to a single column at `mobile` with `space-4` vertical gaps.
- **Color**: background `neutral-100` (the one section using the alternate background token, to visually separate it from the white hero above without a hard border line).
- **Accessibility**: this is not a heading-bearing section (no `h2`) — it's a supplementary trust strip, marked as a `region` with an `aria-label` ("Trust indicators") for screen-reader landmark navigation.

## Problem → Solution
- **Spacing**: `space-8` above/below. `text-h2` to card grid gap: `space-6`.
- **Typography**: `text-h2` headline, `ink-900`, centered. Card headline `text-h3`, card body `text-body-sm`.
- **Component sizes**: 3 feature cards (standard feature-card spec), grid per the responsive framework.
- **Color**: background `white`. The "✓" solution sub-line within each card uses `green-600` for the checkmark icon only, text stays `neutral-700`.
- **Accessibility**: each card's problem/solution pairing is in one semantic block (not two disconnected list items) so a screen reader announces them as one unit ("Unclear scope. Solved by: AI builds a structured scope of work.").

## How It Works — Homeowners
- **Spacing**: `space-8` above/below; stepper items `space-7` apart horizontally at desktop.
- **Typography**: `text-h2` + `text-body-lg` intro, then step numbers as a `text-h3`-sized circular badge (32px circle, `ink-900` background, `white` numeral) followed by `icon-xl` and a `text-h3` step label.
- **Component sizes**: mid-page `btn-primary`, default 48px height (not hero-size — reserving the 56px hero size exclusively for the true hero keeps a clear "this is THE hero" signal).
- **Responsive**: stepper becomes a vertical stack at `tablet`/`mobile`, with a connecting vertical line (1px `neutral-300`) instead of the horizontal connector shown in the wireframe.
- **Color**: background `white`.
- **Accessibility**: stepper is marked up as an ordered list (`<ol>`) semantically, even though visually presented as horizontal cards — so screen readers announce "Step 1 of 3," etc.

## AI Features Spotlight
- **Spacing**: `space-8` above/below; 4-card grid `space-7` gaps; image `space-6` below the grid.
- **Typography**: `text-h2`, 4 cards each `text-h3` + `text-body-sm` (standard feature-card spec, `icon-lg` icons).
- **Responsive**: 4-column grid → 2-column at `tablet` → 1-column at `mobile` (this grid has 4 items rather than the standard 3, noted here as the one deviation from the default 3-column card-grid rule).
- **Color**: background `white`. The before/after image uses a `neutral-100` panel for the "before" (raw text) side and a `white` card with `shadow-sm` for the "after" (structured scope) side, visually reinforcing which state is the improvement.
- **Accessibility**: the before/after image needs full descriptive alt text or an adjacent visually-hidden text equivalent, since the comparison it's making is meaningful content, not decoration.

## How It Works — Contractors
- Identical spec to "How It Works — Homeowners" above (same component, same spacing/typography rules), applied with contractor content. The only intentional visual difference is the `btn-secondary` mid-section CTA ("Join as a Contractor →") rather than primary — because this page's overall primary CTA remains the homeowner action (per the CTA strategy doc), even though this specific section is contractor-facing.

## Testimonials
- **Spacing**: `space-8` above/below.
- **Component sizes**: standard testimonial-card spec, 3-up grid at desktop, horizontally scrollable carousel if more than 3 are shown (with visible pagination dots, `icon-sm`-sized, `neutral-300`/`ink-900` active).
- **Responsive**: carousel becomes swipeable (touch/drag) at `tablet`/`mobile` rather than a static grid.
- **Accessibility**: if implemented as an auto-advancing carousel, it must include a pause control per the accessibility doc's motion rule; each slide is reachable via keyboard (arrow keys or tab-through), and slide-change is announced via `aria-live="polite"` only if triggered by user action (not on auto-advance, to avoid noisy announcements).

## Statistics
- **Spacing**: `space-8` above/below.
- **Component sizes**: standard stat-item spec, 4 items, `space-8` gaps, centered row.
- **Color**: background `neutral-100` (alternate background again, consistent with the trust bar's treatment — both are "quiet proof" sections).
- **Note**: per `marketing-03-homepage.md`'s design note, this section should not render with fabricated numbers — if real data isn't yet available, this section is omitted from the page entirely rather than shipped with placeholder-that-looks-real numbers.

## Trust & Verification (deep-touch)
- Same feature-card pattern as Problem→Solution (3 cards), `green-600` icons throughout (license/insurance/trust-score icons all use the trust-verification color, distinct from the neutral icon default, to visually tie this section together as "the trust section").

## Pricing teaser
- **Spacing**: `space-6` (tighter than the standard `space-8`) above/below — intentionally a lower-emphasis, single-column text block, not a full section, per the "low visual weight" note in the homepage doc.
- **Typography**: `text-h2` at a slightly reduced visual prominence achieved through spacing (less surrounding whitespace) rather than a smaller font size — keeping the type scale consistent while using space itself as the hierarchy signal.

## Blog/Resources teaser
- Standard content-card spec, 3-up grid, `space-8` section spacing.

## Final CTA band
- **Spacing**: `space-10` above, full-bleed background color block (extends beyond the 1200px container to the full viewport width), `space-8` internal padding top/bottom.
- **Typography**: `text-h2`, `white` (verified 13.1:1 against `ink-900`), subtext `text-body-lg`, `neutral-300` (footer-style muted-on-dark tone, not full white, to keep the headline as the visual priority within this band).
- **Color**: background `ink-900` — the one place on the page besides the footer that uses the dark brand color, deliberately, so it reads as a distinct "closing statement" block rather than another white section.
- **Component sizes**: two hero-size (56px) buttons — this is the only other section besides the true hero permitted to use hero-size buttons, since it's explicitly the page's second-most-important moment.
