# UI Specification — Contact

Base layout: `wf-07-contact.md`. Inherits global rules. Per the wireframe's own design note, every section on this page is intentionally compressed relative to the standard section spacing used elsewhere — this page's job is speed, not persuasion.

## Hero (minimal)
- **Spacing**: `space-6` above/below (not `space-8`/`space-10`) — height target ~240px.
- **Typography**: `text-h1` only, no subtext, no eyebrow.

## Contact form + Direct info (two-column layout)
- **Layout**: 60/40 split at desktop/laptop (form left, direct info right), stacking to a single column (form first, info second) at tablet/mobile.
- **Component sizes**: all form fields use the standard input component from `ui-01-components.md` — text input (name, email), textarea (message, 120px min-height), select (the "I am a..." dropdown).
- **Spacing**: `space-5` gap between form fields, `space-6` gap between the last field and the submit button.
- **Typography**: field labels `text-body-sm` weight 600; direct-info column headers `text-h3`, email links `text-body` styled as a text-link (underline on hover, `ink-900`).
- **Submit button**: `btn-primary`, default 48px, full-width within the form column (not auto-width) — a full-width submit button on a short form is a stronger, clearer call to finish the task than a small auto-width button floating at the form's natural text width.
- **Accessibility**: the "I am a..." select is the form's functional centerpiece (routes the message) — its label must be explicit ("I am a...") and its options must be real text values a screen reader announces clearly (Homeowner / Contractor / Brand or Partner / Press / Other), not icon-coded.

## Trust reinforcement (compressed feature section)
- **Spacing**: `space-5` above/below (tighter than the standard `space-8`).
- **Component**: single-line icon + text, `icon-md` + `text-body-sm`, centered, no card container — this is the lightest-weight "feature section" treatment used anywhere on the site, deliberately, per the page's minimal-friction goal.

## Testimonial (single, compressed)
- One testimonial-card component, but a condensed variant: photo + quote + attribution only, no star rating row, no "Verified Project" tag (this testimonial is about support responsiveness, not a project review, so the verified-project tag doesn't apply here — using it would misrepresent what's being verified).

## Statistics (single-line, compressed)
- Two stat items shown inline in a single row (not the standard multi-item stat band with large `text-h1`-sized numbers) — numbers rendered at `text-h3` size with `icon-sm` icons, since a compressed treatment matches this page's overall restraint.

## CTA band (soft)
- **Spacing**: `space-8` above/below (not the full `space-10` treatment other pages' final CTA gets) — and no `ink-900` full-bleed background; this band stays on the default `white` background with two `btn-secondary` buttons only (no `btn-primary`), since a hard-sell primary CTA is the wrong tone for a page whose visitor is likely seeking help, not ready to convert.

## Page-specific accessibility note
- Form validation errors must be summarized at the top of the form (a visually-hidden or visible error summary region, `aria-live="assertive"`) in addition to inline per-field errors, so a screen-reader user attempting to submit an incomplete form gets one clear announcement rather than having to discover each error field-by-field.
