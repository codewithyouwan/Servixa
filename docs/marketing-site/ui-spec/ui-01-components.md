# UI Specification — Component Library

References tokens from `ui-00-design-tokens.md`. Every page spec in this set implements these components rather than redefining them — page specs only note deltas (which variant/size is used where).

## 1. Buttons

Exactly two visual weights exist, matching the CTA hierarchy already established in `marketing-07-cta-strategy.md` — no third "tertiary button" style, to keep the one-primary-action-per-view rule enforceable at the component level, not just by convention.

| Variant | Fill | Border | Text | Height | Padding (h) | Radius | States |
|---|---|---|---|---|---|---|---|
| **Primary** (`btn-primary`) | `accent-600` | none | `ink-900`, `text-button` | 48px (default) / 56px (hero-size) | 24px | `radius-md` | Hover: fill → `accent-700`. Active: fill `accent-700`, scale 98%. Focus: 2px `accent-600` outline, 2px offset. Disabled: fill `neutral-300`, text `neutral-500`, no hover. |
| **Secondary/Outline** (`btn-secondary`) | transparent | 1.5px `ink-900` | `ink-900`, `text-button` | 48px / 56px | 24px | `radius-md` | Hover: background `neutral-100`. Active: background `neutral-300`. Focus: 2px `accent-600` outline. Disabled: border/text `neutral-300`. |
| **Text link CTA** (used for "Log In," in-card links like "Learn About Trust & Safety →") | none | none | `ink-900` underline-on-hover, `text-button` at 16px or `text-body-sm` at 14px depending on context | 24-32px (line height only, no button box) | 0 | — | Hover: underline appears. Focus: 2px `accent-600` outline around the text bounding box. |

**On dark backgrounds** (footer, final CTA band, which use `color-ink-950` per the token doc): Primary stays `accent-600` fill / `white` text (contrast holds regardless of page background). Secondary swaps to `white` border + `white` text (never `ink-900`-on-`ink-950`, which would be illegible).

**Icon-in-button**: when a button includes a trailing arrow ("→"), it's a text glyph or `icon-sm`, positioned `space-2` (8px) after the label, never replacing the label.

**Minimum tap target**: 48px height satisfies the 44-48px minimum touch target guidance at every breakpoint — buttons are never shrunk below this on mobile, even if visually they could be smaller (see responsive doc).

## 2. Inputs (forms — Contact page primarily, plus newsletter/email-capture if used)

| Element | Spec |
|---|---|
| Text input / textarea | Height 48px (single-line), min-height 120px (textarea). Border 1px `neutral-300`, `radius-sm`. Padding: `space-3` vertical, `space-4` horizontal. Text: `text-body`, color `neutral-900`. Placeholder: `neutral-500`. |
| Focus state | Border becomes `accent-600`, 2px, plus a subtle `shadow-sm` in blue-tint — never rely on border-color change alone for focus, since that fails for users with color-vision deficiency; the added shadow/thickness change is the non-color signal. |
| Error state | Border `red-500`, 2px. An inline error message in `text-body-sm`, `red-500`, positioned directly below the field with `space-2` gap, prefixed with an alert icon (`icon-sm`, `red-500`). Error text is programmatically associated with the input (`aria-describedby`) — see accessibility doc. |
| Label | `text-body-sm`, weight 600, `neutral-900`, positioned above the field with `space-2` gap — labels are always visible, never placeholder-only (placeholder-as-label fails for anyone who starts typing and forgets the field's purpose, and fails accessibility guidance outright). |
| Select/Dropdown (e.g. Contact page's "I am a..." selector) | Same height/border/radius as text input. Chevron icon (`icon-sm`, `neutral-700`) right-aligned, `space-4` from the edge. Open state: dropdown panel `shadow-md`, `radius-sm`, `space-2` gap below the trigger, options list `text-body` with `space-3` vertical padding per option, hover background `neutral-100`. |
| Search input (FAQ, Blog/Cost Guide hub) | Same base spec, with a leading search icon (`icon-sm`, `neutral-500`) at `space-4` from the left edge, input text padding-left adjusted to `space-4 + icon-sm + space-2` to avoid overlapping the icon. |

## 3. Cards

Three card patterns cover every card usage across the wireframes — feature cards, testimonial cards, and content/guide cards.

| Pattern | Spec |
|---|---|
| **Feature card** (icon + short text, used in Problem/Solution, Why-Us, AI Spotlight grids) | Background `white`, border 1px `neutral-300` (no shadow at rest — flat style), `radius-md`, padding `space-5` (24px) all sides. Internal layout: icon (`icon-lg`) at top with `space-4` gap to `text-h3` headline, `space-2` gap to `text-body-sm` description. Hover (if the card is a link, e.g. category icons linking to guides): border becomes `ink-900`, `shadow-sm` appears — a deliberate, subtle lift, not a scale/bounce animation, matching the calm tone trust content needs. |
| **Testimonial card** | Background `white`, border 1px `neutral-300`, `radius-md`, padding `space-5`. Contains: avatar photo (40px circle, `radius-full`) + name/location (`text-body-sm`, weight 600) on one row with `space-3` gap; star rating row (`icon-sm` × 5, `accent-600` filled / `neutral-300` empty) with `space-2` top margin; quote body `text-body` in `neutral-700`, `space-3` top margin; a "Verified Project ✓" tag (`text-body-sm`, `green-600`, with a small `icon-sm` check) at the bottom, `space-3` top margin — this tag is the one non-negotiable element on every testimonial card, per the trust-building doc's requirement that verified-project attribution appear on every review. |
| **Content/guide card** (Blog/Cost Guide hub grid) | Background `white`, border 1px `neutral-300`, `radius-md`, no padding around the thumbnail (image is edge-to-edge at the card's top, `radius-md` clipped to match), `space-4` padding around the text block below the image. Thumbnail aspect ratio 16:9. Category tag (small pill, `neutral-100` background, `text-body-sm`, `ink-900` text, `radius-full`, `space-2`/`space-3` padding) sits above the card headline (`text-h3`). |

**Grid behavior** (applies to all card grids): 3 columns at `desktop`/`laptop`, 2 columns at `tablet`, 1 column at `mobile`. Column gap and row gap both `space-7` (48px) at desktop, reducing to `space-5` (24px) at tablet/mobile — full detail in the responsive doc.

## 4. Tables (Pricing comparison, AI Features "How We Compare")

| Element | Spec |
|---|---|
| Container | Border 1px `neutral-300`, `radius-md`, overflow-x auto on narrow viewports (tables do not reflow into cards — a comparison table's value is in column alignment, so on mobile it scrolls horizontally within its container rather than restructuring, with a visible scroll-shadow/affordance on the right edge to signal there's more). |
| Header row | Background `neutral-100`, text `text-body-sm` weight 600, `ink-900`, padding `space-4` vertical / `space-5` horizontal, bottom border 1px `neutral-300`. |
| Body rows | Padding `space-4`/`space-5`, text `text-body`, `neutral-700`. Alternating row background is **not** used (a flat, evenly-spaced table reads calmer and more premium, matching Stripe/Linear's table style, versus a striped table which reads more like a data-dense admin tool — inappropriate tone for a marketing page). Row divider: 1px `neutral-300` between rows only, no vertical column dividers (cleaner scan). |
| Cell content — checkmarks | `icon-sm`, `green-600` for included/✓, `neutral-300` for not-included/✗ (never `red-500` for "not included" — that reads as an error/warning rather than a neutral absence, which is the wrong tone for a competitor-neutral or tier-comparison table). |
| Highlighted column (e.g. "Pro" recommended tier) | Column background `neutral-100`, top border `accent-600` 3px to visually flag it as the recommended option — this is the only table styling that breaks the "no vertical dividers" rule, intentionally, since it's flagging a whole column rather than separating data. |

## 5. Navigation

### Header (identical structure on every page, per the wireframes' shared skeleton)
- Height: 72px, fixed/sticky, `white` background, bottom border 1px `neutral-300` (border appears only after the user scrolls past 0px — at the very top of the page on a hero with a photo background, the header can sit borderless/transparent-over-image if the hero design calls for it; default is bordered white).
- Logo: left-aligned, `space-8` (or the container's left margin) from the edge, fixed height 32px.
- Nav links: `text-body`, weight 500, `neutral-900`, `space-6` (32px) gap between each link. Active/current-page link gets a 2px `accent-600` underline, offset 8px below the text.
- "Resources ▾" dropdown: same trigger style as a nav link, chevron `icon-sm` with `space-1` gap; panel appears below on hover/click, `shadow-md`, `radius-md`, `white` background, `space-4` padding, list items `text-body` with `space-3` vertical padding each.
- "Log In": `text-body`, weight 500, `neutral-700` (deliberately lower contrast/weight than the primary nav links, per the CTA strategy's "lowest visual weight" rule for this element).
- Primary CTA button: `btn-primary`, default 48px height, right-aligned with `space-8` margin from the container edge.

### Footer (identical structure on every page)
- Background `ink-900`, text defaults to `neutral-300` (body links) and `white` (column headers) — verified contrast per token doc.
- 5-column grid at desktop (`Company` / `For Homeowners` / `For Contractors` / `Trust & Resources` / `Legal`), each column header `text-body-sm` weight 600 `white`, links below at `text-body-sm` `neutral-300` with `space-3` vertical gap between links, `space-6` gap between column header and first link.
- Bottom bar: 1px top border `ink-800`, `space-6` padding-top, containing copyright text (`text-body-sm`, `neutral-300`), social icons (`icon-md`, `neutral-300`, `space-4` gap between icons, hover → `white`), and the trust strip (shield + lock icons with short labels, `text-body-sm`, `neutral-300`).
- Column stacking on mobile: 5 columns → single column, each section becomes a collapsible accordion (per the responsive doc) to avoid an extremely long unbroken scroll of links.

## 6. Supplementary components

- **Badge/Pill** (e.g. "Verified" badge, category tags): `radius-full`, `text-body-sm` weight 600, padding `space-2`/`space-3`. Verified badge specifically: `green-600` text on a `green-600`-at-10%-opacity background, with a small check icon — this specific color pairing is reserved exclusively for verification status, never reused for unrelated tags, so its meaning stays unambiguous site-wide.
- **Accordion** (FAQ): trigger row height 56px min, `text-h3` at 18px (a slightly smaller H3 than the card variant, since FAQ questions are denser), chevron `icon-md` right-aligned, rotates 180° when expanded. Expanded panel: `space-4` top padding, `text-body`, `neutral-700`, border-bottom 1px `neutral-300` persists whether expanded or not (so the list has consistent rhythm scanning down).
- **Tabs** (How It Works, FAQ audience tabs): underline-style tabs, `text-body` weight 600, inactive tabs `neutral-500`, active tab `ink-900` with 2px `accent-600` underline, `space-6` gap between tabs, entire tab row bottom-bordered 1px `neutral-300`.
- **Stat/number band item**: number in `text-h1` size but weight 700 `ink-900`, label below in `text-body-sm` `neutral-700`, `space-2` gap, center-aligned, items separated by `space-8` horizontally at desktop.
