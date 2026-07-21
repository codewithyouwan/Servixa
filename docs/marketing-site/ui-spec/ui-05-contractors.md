# UI Specification — For Contractors

Base layout: `wf-03-contractors.md`. Inherits global rules; deltas from `ui-04-homeowners.md`'s pattern noted below (the two audience pages are structural mirrors of each other).

## Header (page-specific delta)
- Per `marketing-02-navigation.md`, the header's primary CTA swaps to `btn-primary` "Join as a Contractor →" on this page specifically — implemented as a route-based conditional on the shared header component, not a separate header component, so the nav stays a single source of truth.

## Hero
- Same spec as Homeowners hero, mirrored: single `btn-primary` "Join as a Contractor →", no secondary button. Image: contractor at work (real photo, not stock-posed), with a floating "New Lead" notification card (`shadow-lg`, `radius-md`, ~260px wide) — this page does get a floating UI card (unlike the Homeowners page), because the "proof the product works" moment for a contractor is specifically seeing what a lead notification looks like, which is worth showing concretely.

## The Problem With Other Platforms
- Single-column text block, no cards — `text-h2` + `text-body-lg` paragraph, max-width constrained to ~720px (not full 1200px container) even at desktop, since a long paragraph at full container width exceeds comfortable reading line-length (~75-85 characters per line is the target; unconstrained width at 1200px would run well past that).

## What You Get
- 4-card grid, identical component/spacing to Homeowners' "Why Homeowners Choose Us" section.

## How It Works (expanded)
- Identical component to Homeowners' expanded stepper. Mid-page CTA copy: "Get Verified & Start Getting Leads →", `btn-primary` default size.

## Trust Score Explained
- **Component**: a custom "gauge" visual — spec as a horizontal segmented bar, 100% width up to 480px, height 12px, `radius-full`, composed of colored segments (`green-600` for the "good" range, `accent-600` transition, `neutral-300` for unfilled) rather than a circular gauge (a horizontal bar reads faster at a glance and is simpler to make accessible than an SVG radial gauge).
- **Accessibility**: the gauge is decorative/illustrative; the actual Trust Score inputs are also listed as visible text labels beneath it (not conveyed by the visual alone), and the graphic itself carries `role="img"` with an `aria-label` summarizing what it represents.
- **Typography**: `text-h2` headline, `text-body-lg` subtext, input labels below the gauge at `text-body-sm`.

## Pricing preview (condensed)
- Same low-visual-weight treatment as Home's pricing teaser (`space-6` spacing, no card container, single-column centered text + CTA).

## Testimonials — contractor-filtered
- Same testimonial-card component, contractor-specific copy (trade + city in the attribution line instead of just city).

## Statistics
- Same stat-item component; this page's 3 stats are contractor-relevant (verified contractors, lead acceptance rate, avg. response time) rather than homeowner-relevant — component and spacing identical, content differs.

## FAQ (accordion preview)
- Identical component/spec to Homeowners' FAQ preview, contractor-specific question set.

## Final CTA band
- Identical spec to Homeowners' final CTA band, single `btn-primary` "Join as a Contractor →", headline "Ready to Grow Your Business?"
