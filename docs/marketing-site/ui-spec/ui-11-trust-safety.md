# UI Specification — Trust & Safety

Base layout: `wf-09-trust-safety.md`. Inherits global rules. Per the wireframe's explicit tone note, this page stays visually calm and low-contrast throughout — no heavy-border CTA until the very end — so several of the usual emphasis techniques (accent-colored highlights, bold badges) are deliberately restrained here relative to conversion-focused pages.

## Hero
- **Typography**: `text-h1` (not `text-display`), `text-body-lg` subtext. No buttons in the hero.
- **Color**: no accent-colored highlight anywhere in the hero — headline stays `ink-900`, matching the page's calm, reassurance-first tone.

## Verification Process
- 3-card grid, standard feature-card component, but icon color here is `green-600` (not the default `neutral-700`) throughout this entire page — a page-wide exception to the icon color default, since every icon on this page is reinforcing a trust/verification signal specifically.

## Trust Score — the inputs, explained
- Same gauge component as `ui-05-contractors.md`/`ui-06-ai-features.md`'s Trust Score sections, reused exactly. 4 labeled inputs beneath it (not the 3 shown on the Contractors page's condensed version) — `icon-md` + `text-body-sm` per input, in a single row at desktop wrapping to 2×2 at tablet, single column at mobile.

## Security
- 2-card grid, same feature-card component, `icon-lg` icons (default `neutral-700` color here, not green — security is a distinct concept from verification and shouldn't visually blend into the same green-coded system).

## Badge System
- **Component**: 3 badge/pill components (Verified, Top Rated, Platform Added) shown at a larger-than-usual size for legibility as a explainer (badge height ~32px here vs. the smaller inline badge size used elsewhere, e.g. category tags on the Blog hub), each followed by a `text-body` explanation line, `space-3` gap between badge and its explanation, `space-6` gap between the three badge+explanation groups stacked vertically (not a grid — reads better as a short definition list here).
- **Accessibility**: marked up as a definition list (`<dl>`/`<dt>`/`<dd>`) semantically, since each badge is genuinely a term being defined.

## Testimonials
- Standard testimonial-card component, single card, trust-specific quote framing.

## Statistics
- Standard stat-item component, but the number `100%` (contractors license-checked) is the one instance site-wide of a stat rendered in `green-600` instead of the default `ink-900` — reserved specifically for this page's quality-assurance framing, not used elsewhere, so it doesn't dilute into a generic accent color.

## FAQ
- Standard accordion component, full trust/safety-specific question set.

## Final CTA band
- The only section on this page permitted the standard `ink-900` full-bleed, hero-size dual-button treatment — everything above is deliberately quieter, so this final band is where the page's only real conversion push happens, consistent with the wireframe's design note.
