# Visual Design Language — Servixa Marketing Site

Prepared as Senior Product Designer. Every screen description in this set (`visual-01` through `visual-12`) is a precise application of the language defined here — no page invents its own visual vocabulary. Tokens referenced (`accent-600`, `ink-900`, `space-8`, etc.) are defined in `ui-spec/ui-00-design-tokens.md`, updated in this same pass to match this language.

## 1. The synthesis, stated plainly

Linear, Stripe, Notion, Airbnb, and Vercel don't share a color or a font — they share a discipline: an almost entirely white-and-black canvas, one restrained accent color spent only on the thing that matters most on a given screen, generous air around every element, typography that's precise rather than loud, and shadows so soft they're felt more than seen. This site adopts that discipline. Where the earlier design pass (see `marketing-site/ui-spec/` prior revision) used a warmer, more consumer-marketplace palette closer to Houzz or Thumbtack, this pass deliberately pulls the opposite direction: quieter, more premium, more confident through restraint than through decoration.

## 2. Canvas & surface

- **Every page opens on pure white** (`#FFFFFF`). There is no default off-white or tinted background — white is the resting state, and any deviation from it (the barely-there `#F9FAFB` alternate-section tint, or the true-dark `#0A0A0A` footer/final-CTA band) is a deliberate, sparingly-used exception, not a texture applied throughout.
- **Section boundaries are implied by space, not lines.** Where the earlier pass sometimes used a hairline rule between sections, this language prefers `space-8`–`space-10` of clear air to do that job. A 1px `neutral-300` border appears only around a discrete object (a card, an input, a table) — never as a horizontal rule dividing the page into visible bands.
- **Cards sit flush against white with a hairline border, not a shadow, at rest.** A shadow appears only on hover or on an explicitly "raised" object (the floating hero UI card, a modal, an open dropdown) — this is the exact Linear/Notion convention of reserving elevation for the moment something is actually above the page, rather than using it as decoration on static content.

## 3. Color — how the one accent gets spent

`accent-600` (a clean indigo, `#4F46E5`) is the only saturated color a visitor sees in normal use, and it is spent on exactly four things, in this priority order: the primary button fill, the active/current state of a nav item or tab, a focus ring, and — once per relevant page — a single moment of emphasis (an eyebrow label, a highlighted table column). It never appears twice in the same viewport doing two different jobs; a visitor should always be able to answer "what does the indigo mean here" without ambiguity.

`green-600` is held completely separate as the "this is verified/trustworthy" signal — reserved for badges, checkmarks, and the one Trust & Safety statistic that earns it. This separation is deliberate: if verification and "click here" shared a color, a visitor's eye would stop reliably distinguishing "this is proven" from "this is an action," which is exactly the distinction a trust-driven marketplace can't afford to blur.

Everything else — every headline, every paragraph, every icon at rest, every border — lives in the ink/neutral grayscale. This is what reads as "premium" rather than "flat": a page that could be a black-and-white print and still communicate its full hierarchy through size and weight alone, with color arriving only to mark true interaction points.

## 4. Typography — precision over volume

Inter, set tight. Headlines use `-0.01em` to `-0.02em` letter-spacing at every size 32px and above — a small, specific detail, but it's the single biggest reason Linear/Vercel headlines look "designed" rather than "typed": default browser tracking on a 56px headline reads loose and slightly amateurish, and tightening it is free. Weight tops out at 600 (semibold) even for the largest hero headline — never 700/800/900 bold. This is a deliberate departure from a typical bold, shouty marketing headline: confidence here comes from scale and whitespace, not from heavier ink.

Body copy stays at 16px/26px minimum, in `neutral-700`, never in pure black — pure-black body text at length reads harsher than necessary; a warm dark gray is easier to read across a full paragraph and is the quiet, correct choice this whole family of products makes.

## 5. Iconography — genuinely minimal

Icons are 1.5px-stroke outline glyphs (Lucide-equivalent), sized down from a typical marketing site's icon scale (`icon-lg` is 28px, not 32-40px), and colored `neutral-500` at rest — one step lighter than the body text around them, so they read as quiet supporting marks a visitor's eye can skip past rather than bold graphic elements competing with the headline. An icon earns color (`accent-600` or `green-600`) only when it's the actual carrier of meaning — a verified checkmark, an active tab indicator — never as generic decoration next to a card title.

## 6. Shadows & depth

Three tiers, all low-opacity and diffuse (`shadow-sm` through `shadow-lg` in `ui-00-design-tokens.md`), never a hard single-layer drop shadow. The felt effect should be "this object is very slightly lifted off the page," not "this object is casting a shadow" — the difference is opacity (this system caps around 10% even at its strongest) and blur radius (large and soft rather than tight).

## 7. Corners

`radius-md` (12px) is the default for buttons and cards — visibly rounded, but not a pill. `radius-lg` (20px) is reserved for the handful of larger, higher-emphasis surfaces (the hero's floating UI card, the featured guide card, modals). Rounded corners here read as "considered," not "friendly/playful" — the radius values are large enough to notice, small enough to still feel structured and precise rather than soft/toy-like.

## 8. Photography & illustration direction

Where a real photo is called for (hero images, "how it works" supporting visuals), it should be lit naturally, slightly desaturated rather than punchy/saturated, and cropped generously — no tight, busy compositions. Photos always sit inside a `radius-lg` frame, never edge-to-edge/full-bleed except where a card's own image slot calls for it (content-card thumbnails). Where an illustration is called for instead of a photo (process/stepper visuals), it should be simple line-art in `ink-900`/`neutral-500`, no more than one accent-colored detail per illustration — matching the same "one accent color" discipline applied to the whole page.

## 9. Motion (referenced, not detailed here — see `ui-02-accessibility-and-responsive.md` for the governing rules)

Transitions run 150-250ms, ease-out on entrance and ease-in on exit, and are used only where they clarify state change (hover lift, accordion expand, tab switch) — never as ambient decoration. This matches the same restraint applied everywhere else in this language: motion earns its place by doing a job, not by making the page feel more "alive."

## 10. What NOT to do (anti-patterns for this direction)

- No gradients anywhere — not on buttons, not on backgrounds, not on text.
- No more than one accent color live on screen at once.
- No bold (700+) headline weights.
- No hard, dark, single-layer drop shadows.
- No icon-and-color combinations that duplicate the accent's meaning (e.g. a second "clickable" color).
- No dense icon rows purely for decoration — every icon present should be doing legibility work.
