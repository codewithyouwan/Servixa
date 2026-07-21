# UI Specification — AI Features

Base layout: `wf-04-ai-features.md`. Inherits global rules; audience-neutral page, so dual-CTA pattern (like Home) applies throughout rather than the single-CTA lock used on the Homeowners/Contractors pages.

## Hero
- Same spec as Home's hero, but shorter (`~560px` vs `~640px` target height — achieved via slightly reduced internal spacing, not a smaller headline size) and no image/floating-card requirement in the hero itself, since each feature below gets its own supporting visual — no need to front-load one in the hero.
- Two default-size (48px, not hero-size 56px) buttons here rather than hero-size — this page's hero is a secondary entry point relative to Home, so button size itself signals it's one step down in "the" primary hero hierarchy.

## Feature sections (×4: AI Project Assistant, Smart Matching, Trust Score, AI Proposal Drafting)
- **Spacing**: each feature is its own full-width section, `space-8` between sections (not a shared grid — deliberately more spacious than the homepage's 4-up teaser grid, since this page's job is to explain each in depth).
- **Typography**: `text-h2` per feature, `text-body-lg` subtext directly below with `space-5` gap.
- **AI Project Assistant section**: supporting visual is the before/after comparison (raw text box → structured card), same component spec as Home's version but larger (full 1200px container width vs. Home's constrained teaser size) since this page has room to let it breathe.
- **Smart Matching section**: 6 inline icon+label chips (Category, Location, Budget, Availability, Ratings, Track Record) in a single wrapped row, `icon-md` + `text-body` each, `space-4` gap between chips — not a card grid, since these are inputs to one concept rather than 6 separate ideas each deserving a card.
- **Trust Score section**: same gauge component as the Contractors page's Trust Score section (`ui-05-contractors.md`) — reused exactly, not redesigned, since it's the same concept explained to a different audience.
- **AI Proposal Drafting section**: shortest of the four (it's contractor-facing detail on an otherwise neutral page), ends with a `btn-secondary` "For Contractors →" linking out, rather than a repeated primary CTA.

## How We're Different (comparison table)
- **Component**: standard comparison table from `ui-01-components.md`, 4 columns (row label + Us + Traditional Directories + Generic Lead-Gen). "Us" column gets the highlighted-column treatment (top border `accent-600`, `neutral-100` background) since it's the column the table exists to favorably distinguish, not a "recommended tier" in the pricing sense but visually using the same convention for consistency.
- **Responsive**: horizontal scroll on `mobile`/`tablet`, per the table rules in `ui-02-accessibility-and-responsive.md`.

## Final CTA band
- Identical spec to Home's, dual buttons at hero-size (56px), since this is this page's single final conversion moment and deserves the same weight as Home's.
