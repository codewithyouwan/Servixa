# UI Specification — Accessibility & Responsive Standards

Global standards applied to every page in this set. Page-specific specs reference this document rather than restating these rules.

## 1. Accessibility standard

**Target: WCAG 2.1 Level AA**, site-wide, non-negotiable given the audience includes people making high-stakes financial decisions (posting a $30k renovation project) who cannot be excluded by inaccessible design.

### Color & contrast
- All text/background pairs meet the ratios in `ui-00-design-tokens.md` §1 (4.5:1 normal text, 3:1 large text ≥24px or ≥19px bold, 3:1 for meaningful UI component boundaries like input borders and icon-only controls).
- Color is never the sole carrier of meaning: form errors pair a red border with an icon and text message; the "recommended plan" table column pairs a colored border with a label ("Most Popular"), not color alone; verified badges pair green with a check icon and the word "Verified."

### Keyboard navigation
- Every interactive element (nav links, buttons, form fields, accordion triggers, tabs, dropdown menus) is reachable via `Tab` and operable via `Enter`/`Space`, in a logical DOM order matching visual order (header → hero → sections top-to-bottom → footer).
- Visible focus indicator on every focusable element: 2px `accent-600` outline, 2px offset, never `outline: none` without a replacement — this is the most commonly broken accessibility requirement on marketing sites and is treated as mandatory here, not optional polish.
- Skip-to-content link: visually hidden until focused, appears as the very first focusable element on every page, jumping past the header/nav directly to the main content region — matters specifically because the header/nav is identical and repeated on every page, and keyboard/screen-reader users shouldn't have to tab through it on every navigation.

### Screen reader / semantic structure
- One `<h1>` per page (the hero headline, or the page-title H1 on non-hero pages) with a logical, non-skipping heading hierarchy below it (`h2` for sections, `h3` for cards) — headings describe content, never used purely for visual size.
- Landmark regions: `header`, `nav`, `main`, `footer` used semantically, not generic `div`s, so screen-reader users can jump between regions.
- All icons that accompany a text label are marked decorative (`aria-hidden="true"`) since the adjacent text already conveys the meaning — no redundant announcement of "icon" before the label text.
- Any icon-only control (rare on this site, per the components doc's "never icon-only" rule, but applies to things like the FAQ accordion chevron) gets an `aria-label` describing its function if it's independently interactive, or is treated as purely decorative if it's inside an already-labeled parent control (e.g. the chevron inside an accordion trigger whose full row is the labeled control).
- Form fields: every input has a programmatically associated `<label>` (not placeholder-only, per the components doc); error messages are linked via `aria-describedby` and the field is marked `aria-invalid="true"` when in an error state; the whole form's segmented "I am a..." selector on the Contact page announces its current value on change so screen-reader users get the same routing context sighted users get visually.
- Live regions: form submission success/error states and any dynamically-loaded content (e.g. "Load More" pagination results) are announced via `aria-live="polite"` so the outcome isn't silent for screen-reader users.

### Motion & animation
- Card hover lifts, accordion expand/collapse, and tab transitions are respectful of `prefers-reduced-motion` — when that OS-level setting is on, transitions collapse to instant state changes rather than animated ones. No auto-playing carousels advance without user control (testimonial carousels, if implemented as an auto-rotating component, must have a pause control and must not auto-advance for a `prefers-reduced-motion` user).

### Images & media
- Every meaningful image (hero photography, "how it works" illustrations, testimonial avatars) has descriptive `alt` text; purely decorative images (background textures) have empty `alt=""` so screen readers skip them rather than reading a meaningless filename-derived description.

## 2. Responsive behavior framework

Breakpoints (from `ui-00-design-tokens.md` §4): `mobile` <768px · `tablet` 768–1023px · `laptop` 1024–1279px · `desktop` ≥1280px. This document defines the rules that apply across all pages; each page spec calls out only where its content deviates from these defaults.

### Layout
- Content container: 1200px max-width at `desktop`/`laptop`, with fluid side margins as described in the tokens doc. At `tablet`, container margin drops to 32px fixed; at `mobile`, to 16px fixed.
- Section vertical spacing (`space-8`/`space-10` at desktop) compresses at narrower breakpoints: `space-8` (64px) → 48px at tablet → 32px at mobile; `space-10` (128px, hero/final-CTA only) → 80px at tablet → 48px at mobile. Compressing rather than eliminating this spacing preserves the section-separation hierarchy on small screens without wasting scroll-heavy vertical space.
- Card grids: 3-column (desktop/laptop) → 2-column (tablet) → 1-column (mobile), per the components doc.
- Multi-column layouts with a text+image split (hero, Problem→Solution imagery, feature sections with a supporting visual) stack vertically at `tablet` and below, text block first, image second — text-first ordering matters because the headline/value prop is the priority content, and images are supporting evidence, not the reverse.

### Navigation
- **Desktop/laptop**: full header as specified in the components doc — all nav links visible, primary CTA button visible.
- **Tablet**: "Resources" dropdown items may combine with primary nav links into a single hamburger menu if the full link set doesn't comfortably fit; primary CTA button remains visible and is not hidden behind the hamburger menu (the single most important element on the page during a task explicitly about conversion should never require an extra tap to reveal).
- **Mobile**: header collapses to logo + hamburger icon + primary CTA button (hamburger opens a full-screen or slide-in menu containing all nav links, with "For Homeowners"/"For Contractors" as large, tappable rows at the top of that menu — not buried under smaller secondary links, per `marketing-02-navigation.md`'s mobile guidance). Additionally, a **sticky bottom CTA bar** appears on mobile (fixed position, `white` background, top border 1px `neutral-300`, containing the single primary CTA button at full width minus 16px side padding) — this persists regardless of scroll position so the primary action is always one tap away without scrolling back to the top.
- Footer: 5 columns (desktop/laptop) → 2 columns (tablet) → single column with each column as a collapsible accordion (mobile), per the components doc.

### Typography
- `text-display`/`text-h1`/`text-h2` scale down at `mobile` per the sizes given in `ui-00-design-tokens.md` §2. Body text sizes hold constant across all breakpoints — reducing body text on mobile is a common but real readability regression this spec explicitly avoids.

### Touch targets
- All interactive elements maintain a minimum 48px touch target at `tablet`/`mobile` regardless of visual size — icon-only controls (rare, per component rules) get invisible padding to reach 48px even if the icon glyph itself renders smaller.

### Tables
- Comparison tables (Pricing, AI Features) do not restructure into stacked cards on mobile — they remain true tables with horizontal scroll within their container, per the components doc, since reflowing a comparison table into cards loses the column-alignment that makes a comparison legible in the first place.

### Images
- Hero and feature images use responsive source sets (multiple resolutions) so a mobile viewport isn't downloading a desktop-resolution asset — a performance requirement, not just a visual one, given Core Web Vitals affects both SEO ranking and the credibility-through-speed point made in `marketing-06-seo.md`.
