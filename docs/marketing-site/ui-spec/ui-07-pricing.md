# UI Specification — Pricing

Base layout: `wf-05-pricing.md`. Inherits global rules.

## Hero (short, text-led)
- **Spacing**: reduced height target (~320px) vs. other pages — achieved by using `space-8` above/below instead of `space-10`, and no image, consistent with the wireframe's explicit note that pricing pages should stay minimal.
- **Typography**: `text-h1` (not `text-display` — this page doesn't get the hero-scale treatment, since per the wireframe notes its job is a fast, calm answer, not a persuasion moment), `text-body-lg` subtext.

## Homeowner pricing block
- **Component**: a single card, centered, max-width ~420px (deliberately not full-width — this card should read as a distinct, self-contained answer, not stretch to fill the container like a grid item would).
- **Spacing**: `space-6` internal padding (more generous than the standard feature-card's `space-5`, since this card is the page's focal point).
- **Typography**: "$0" rendered at `text-display` size, `ink-900` — the single largest piece of text on the page, deliberately, since it's the answer the visitor came for.
- **Component sizes**: `btn-primary`, default 48px.
- **Color**: card border 1.5px `ink-900` (slightly heavier than the standard 1px `neutral-300` card border) to visually anchor it as more important than a standard feature card.

## Contractor pricing block (tiered cards)
- **Component sizes**: 3 pricing-tier cards, equal width, `space-7` gaps, in a row at desktop/laptop, stacking to single column at tablet/mobile (not 2-column — 3 pricing tiers reading top-to-bottom on mobile is clearer than an awkward 2+1 split).
- **Middle tier ("Pro") emphasis**: per the wireframe notes, this card gets the heavy-border treatment — 2px `accent-600` border (vs. 1px `neutral-300` on the other two), plus a small "Recommended" badge (standard badge/pill component, `accent-600`-tinted) positioned overlapping the card's top edge, centered.
- **Typography**: tier name `text-h3`, price `text-h1` size (large, but one step below the homeowner card's `text-display`, since the homeowner $0 is still the page's single most important number), feature list items `text-body-sm` with a leading `icon-sm` check (`green-600`).
- **Component sizes**: each tier's button is `btn-primary` for the recommended tier, `btn-secondary` for the other two — only one heavy-weight button visible across all three cards, consistent with the one-primary-action rule even within a multi-card section.

## What's Included (comparison table)
- Standard comparison table component. Highlighted column = the "Pro" column, matching the card emphasis above for visual consistency between the pricing cards and the table beneath them.

## Testimonials — value/ROI-focused
- Standard testimonial-card component, 2-up.

## Statistics
- Standard stat-item component, 3 items.

## FAQ (pricing-specific)
- Standard accordion component, full question set shown directly on this page (not a 4-item preview linking elsewhere, since pricing FAQs are short enough and directly relevant enough to include in full here).

## Final CTA band
- Same dual-button spec as Home's final CTA band.

## Page-specific accessibility note
- The tiered pricing cards must be understandable via screen reader without relying on the visual "Recommended" badge position alone — the badge text itself ("Recommended") is real text content read in-flow, not a background image or icon-only indicator.
