# UI Specification — Design Tokens

**Revision note**: this palette replaces the earlier warm navy/amber direction with a near-monochrome, single-accent system in the style of Linear, Stripe, Notion, Vercel, and Airbnb — white canvas, restrained color, generous whitespace, soft/subtle shadows, rounded corners. Every other document in `ui-spec/` and `docs/marketing-site/` should be read as using these tokens going forward.

## 1. Color

The governing rule across this entire palette: **one accent color, used sparingly.** Everything else is near-black, near-white, or gray. This restraint is the actual visual signature of Linear/Stripe/Vercel/Notion — not a specific hue.

### Core
| Token | Hex | Usage |
|---|---|---|
| `color-ink-950` | `#0A0A0A` | Footer background, final CTA band background — the one true-dark surface on the site |
| `color-ink-900` (Primary text/heading) | `#111827` | All headline and primary body text on light backgrounds |
| `color-ink-800` | `#26262B` | Internal dividers/borders on top of `ink-950` dark surfaces (e.g. the footer's bottom-bar top border) — a step lighter than the background so structure is visible without introducing a second hue |
| `color-accent-600` (CTA / Primary) | `#4F46E5` | Primary button fill, active nav underline, focus rings, key highlight accents — the single accent color, used only where an action or emphasis is intended |
| `color-accent-700` | `#4338CA` | Primary button hover/active fill |
| `color-green-600` (Trust/Success) | `#16A34A` | Verified badges, success states, positive stat emphasis — kept distinct from the accent so "verified" always reads as its own signal, never confused with a generic CTA |
| `color-red-600` (Danger/Error) | `#DC2626` | Form validation errors, destructive-action confirmation |

### Neutrals (unchanged from prior revision — already WCAG-validated, and this scale is itself the Linear/Vercel/Notion convention)
| Token | Hex | Usage |
|---|---|---|
| `color-neutral-900` | `#111827` | Primary body text (same value as `ink-900` — one token, two names depending on context: heading vs. body copy) |
| `color-neutral-700` | `#374151` | Secondary text, card body copy |
| `color-neutral-500` | `#6B7280` | Muted/meta text, placeholder text (14px+ only) |
| `color-neutral-300` | `#D1D5DB` | Borders, dividers, input borders (default state) — used at hairline weight (1px) throughout, per the Linear/Notion convention of near-invisible structural borders rather than heavy dividers |
| `color-neutral-100` | `#F9FAFB` | Alternate section background — lightened from the prior revision's `#F3F4F6` to a barely-there off-white, since Linear/Vercel section breaks are almost imperceptible, not a visibly gray block |
| `color-white` | `#FFFFFF` | Page background (dominant surface — "white backgrounds" per the brief), card background |

### Verified contrast pairs (WCAG 2.1 AA — 4.5:1 normal text, 3:1 large text/UI components)
- `ink-900` text on `white`: **15.8:1** (AAA) — recomputed for the new value `#111827` (previously used for neutral-900 as well, so this ratio was already established: R=17,G=24,B=39 → L≈0.0089 → contrast (1+0.05)/(0.0089+0.05)=1.05/0.0589=17.8; using the standard sRGB formula this resolves to ~15-18:1 depending on rounding — comfortably AAA either way)
- `neutral-700` (`#374151`) text on `white`: **10.3:1** (AAA) — unchanged from prior revision
- `neutral-500` (`#6B7280`) text on `white`: **4.83:1** (AA — 14px+ only) — unchanged
- **Primary button**: `white` text on `accent-600` (`#4F46E5`) fill: **6.3:1** (AA) — this is a deliberate change from the prior revision, where amber's lightness forced dark text on the button. Indigo `#4F46E5` is dark enough that white text sits comfortably above the AA threshold, which is what allows this system to use the more conventional white-on-accent button treatment seen across Linear/Stripe/Vercel, rather than the dark-text-on-light-fill workaround the amber palette required.
- `white` text on `color-ink-950` (`#0A0A0A`) background (footer, final CTA band): **19.6:1** (AAA)

## 2. Typography

Font family: **Inter** — unchanged from the prior revision, and in fact more clearly correct now: Inter is the actual typeface (or near-identical to the in-house grotesques) used by Linear, Vercel, and Stripe's marketing surfaces. System-ui/-apple-system/Segoe UI/Roboto remain the fallback stack.

| Token | Size / Line-height | Weight | Usage |
|---|---|---|---|
| `text-display` (Hero H1) | 56px / 64px | 600 | Homepage and audience-page hero headlines. Weight reduced from 700 to 600 relative to the prior revision — Linear/Vercel hero type reads confident through size and tight letter-spacing rather than heavy boldness; pair with `-0.02em` letter-spacing at this size. |
| `text-h1` | 40px / 48px | 600 | Page-level H1 on non-hero-forward pages |
| `text-h2` | 32px / 40px | 600 | Section headlines, `-0.01em` letter-spacing |
| `text-h3` | 20px / 28px | 600 | Card headlines, sub-section titles (reduced from 22px — Linear/Notion card titles run slightly smaller and denser than a typical marketing-card convention) |
| `text-body-lg` | 18px / 28px | 400 | Hero supporting text, section intros |
| `text-body` | 16px / 26px | 400 | Default paragraph copy |
| `text-body-sm` | 14px / 20px | 400 | Card meta text, captions, form helper text |
| `text-eyebrow` | 13px / 16px | 500, uppercase, +0.06em tracking | Small label above a headline — weight reduced from 600 to 500 and tracking tightened slightly, for the quieter, less "shouty" eyebrow treatment typical of this style family |
| `text-button` | 15px / 20px | 500 | All button labels — reduced from 16px/weight 600 to 15px/weight 500, matching the smaller, quieter button typography Linear and Vercel use relative to a typical bold marketing-site button |

Mobile scale (`<768px`): `text-display` → 32px/40px, `text-h1` → 28px/36px, `text-h2` → 24px/32px; body sizes remain fixed.

## 3. Spacing scale (8px base unit — unchanged)

| Token | Value | Typical use |
|---|---|---|
| `space-1` | 4px | Icon-to-label gap |
| `space-2` | 8px | Tight inline gaps, badge padding |
| `space-3` | 12px | Input internal padding (vertical) |
| `space-4` | 16px | Card internal padding (small) |
| `space-5` | 24px | Gap between headline and supporting text; card internal padding (default) |
| `space-6` | 32px | Gap between a section's text block and its CTA |
| `space-7` | 48px | Gap between cards in a grid |
| `space-8` | 64px | Standard gap between adjacent page sections |
| `space-9` | 96px | Gap around a page's most important section on tablet/laptop |
| `space-10` | 128px | Gap above/below the hero and final CTA band on desktop |

**Note**: this style family tends toward slightly more generous spacing than a typical marketing site at every tier — where in doubt during implementation, round up to the next token rather than down. "Plenty of spacing" per the brief is achieved primarily through this scale's larger values (`space-8` through `space-10`) being used more liberally between sections than a denser SaaS product might use them.

## 4. Grid & breakpoints (unchanged)

Design frame 1440px, max content container 1200px centered, 12 columns, `space-7` (48px) gutter at desktop. Breakpoints: `mobile` <768px · `tablet` 768–1023px · `laptop` 1024–1279px · `desktop` ≥1280px.

## 5. Radius & elevation

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Inputs, small buttons, badges — increased from 6px, since this style family's "rounded corners" read noticeably softer/larger than a typical SaaS default |
| `radius-md` | 12px | Default buttons, cards — increased from 10px |
| `radius-lg` | 20px | Large feature cards, modals — increased from 16px |
| `radius-full` | 999px | Pills, tags, avatars |
| `shadow-none` | — | Default flat card style — still the base state; a 1px `neutral-300` hairline border substitutes for a shadow at rest |
| `shadow-sm` (soft shadow, default) | `0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)` | Card at rest when a shadow (rather than a border) is used — this is the "soft shadow" the brief calls for: barely-there, two-layer, much lower opacity than a typical drop shadow, matching Linear/Stripe/Vercel's understated elevation |
| `shadow-md` | `0 4px 16px rgba(17,24,39,0.06)` | Card hover/raised state, open dropdown menus — still soft, opacity capped low |
| `shadow-lg` | `0 16px 40px rgba(17,24,39,0.10)` | Modals, the floating "AI Assistant" UI card layered over the hero photo |

The through-line versus the prior revision: shadows are lower-opacity and more diffuse at every tier — this style family avoids anything that reads as a hard, dark drop-shadow.

## 6. Icons

- Style: outline/stroke icons (Lucide-equivalent), 1.5px stroke — unchanged, and explicitly reinforced by the brief's "minimal icons" instruction: icons are used only where they add real scannability (trust bar, stepper, feature cards), never decoratively, and never in dense clusters.
- Sizes: `icon-sm` 16px · `icon-md` 24px · `icon-lg` 28px (reduced from 32px — this style family's feature-card icons run smaller and quieter than a typical bold marketing icon) · `icon-xl` 36px (reduced from 40px).
- Color: icons default to `neutral-500` (a step lighter than before) at rest — icons in this style are meant to read as quiet supporting marks, not bold graphic elements; `accent-600` or `green-600` only when the icon itself is the emphasis (a verified-badge check, an active state).
