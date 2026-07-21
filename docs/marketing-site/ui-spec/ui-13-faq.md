# UI Specification — FAQ

Base layout: `wf-11-faq.md`. Inherits global rules. Per the wireframe's note, this is a dense, scan-first page — section spacing throughout uses `space-6` rather than the default `space-8`, consistently tighter than other pages.

## Hero + Search
- `text-h1`, `space-5` gap to the search input.
- **Component**: search input, standard input component spec with leading search icon, full-width up to a max ~600px (centered) — deliberately narrower than the full container, since a search box wider than that reads oddly and doesn't improve usability.

## Audience tabs
- Standard tabs component (same ARIA pattern as `ui-10-how-it-works.md`), 3 tabs (Homeowners / Contractors / General) instead of 2.

## FAQ accordion (per tab)
- Standard accordion component, full question set per audience (not a preview) — this is the canonical, complete FAQ list; the previews shown on Homeowners/Contractors/Pricing pages all link here.
- **Spacing**: `space-1` between accordion items is not applicable — accordion items are edge-to-edge (border-bottom only serves as the divider, per the components doc), no gap between rows, so the whole list reads as one continuous scannable block rather than a spaced-out card list.

## "Still have questions" feature section
- Single-line icon+text pair (real support team, avg. response time), same compressed treatment as the Contact page's trust-reinforcement section, `btn-secondary` "Contact Us →".

## Testimonial (compressed)
- Same condensed testimonial variant as the Contact page (no star rating, no verified-project tag — this is a support-responsiveness quote, not a project review).

## Statistics (compressed)
- Same single-line compressed stat treatment as Contact.

## Final CTA band
- Standard dual-button `ink-900` full-bleed spec, `space-10` above (this section reverts to the standard generous spacing despite the rest of the page being tighter — the final CTA is still this page's one conversion moment and shouldn't be visually compressed along with the informational content above it).

## Page-specific accessibility note
- The search input should support keyboard-only filtering of the accordion list below it (typing filters visible items) with the result count changes announced via `aria-live="polite"`, consistent with the Reviews page's filter-bar pattern.
