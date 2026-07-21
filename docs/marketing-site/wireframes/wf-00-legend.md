# Wireframe Legend & Conventions

Low-fidelity, desktop-first (1440px design frame, content capped at a 1200px centered container — the Stripe/Linear/Vercel convention of a wide canvas with a comfortably narrow reading/content column). These are structure-and-hierarchy wireframes, not visual design — no color, type, or imagery detail beyond placeholder labels.

## Reading the ASCII

```
════════════  double line   = hard page boundary (top of page, footer start)
────────────  single line   = section boundary within the page
┌ ┐ └ ┘ │ ─   box borders    = a distinct component (card, button, image placeholder)
┃ label ┃    heavy-border box = PRIMARY button (highest visual weight on the page)
┌ label ┐    thin-border box  = SECONDARY button (outline style)
[ IMG: ... ]  bracketed label  = photo/illustration placeholder, content noted inside
{ ICON }     braced label      = icon placeholder
H1 / H2 / Eyebrow             = type hierarchy labels (Eyebrow = small label above a headline)
```

## Shared page skeleton

Every page in this set is built on the same three fixed elements, per the brief's requirement that Header, Navigation, and Footer appear on every page:

1. **Header/Nav** — sticky, 72px tall, identical across all pages except the CTA button label swaps to match page audience (see `marketing-02-navigation.md`).
2. **Page body** — the section stack unique to each page, detailed per wireframe.
3. **Footer** — identical 5-column footer across all pages (see `marketing-02-navigation.md`), collapsed to a single reference line in each wireframe below to avoid repeating it 12 times at full size.

## Spacing scale (applied consistently)

A four-value spacing scale, not an arbitrary one — this is what keeps a low-fidelity wireframe translating cleanly into a real layout later:
- **XS (8-16px)** — between an icon and its label, inside a card
- **S (24-32px)** — between elements within one section (headline → subtext → CTA)
- **M (64-80px)** — between adjacent sections (hero → trust bar, feature → testimonials)
- **L (120px+)** — around the single most important section on a page (the primary hero, and the final CTA band) — generous whitespace here is a deliberate hierarchy signal, the same technique Linear and Stripe use to make the hero read as important simply by giving it more room than anything else on the page.

## Grid

12-column grid, 1200px max content width, 24px gutters. Feature grids default to 3-column (Airbnb/Houzz card-grid convention); comparison/pricing content defaults to 2-3 column depending on tier count.

## Hierarchy conventions used throughout

- Exactly one heavy-border (primary) CTA visible per screen height — this mirrors the "one primary action per view" rule from `marketing-07-cta-strategy.md`.
- Hero sections get the most vertical space on the page (L spacing above/below); dense information (FAQ, comparison tables) gets tighter (S) spacing since scanability matters more than drama there.
- Trust content (verification, stats, badges) is visually quieter than conversion content (no heavy borders, smaller type scale implied) — trust sections earn belief through repetition and specificity, not visual shouting.
