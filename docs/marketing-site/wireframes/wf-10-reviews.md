# Wireframe — Reviews (Desktop, 1440px)

See `wf-00-legend.md` for conventions. This page IS primarily a testimonials page by nature — the "Testimonials" required section becomes the page's main body rather than one section among several, with the other required elements (feature/CTA/stats) wrapped around it.

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                        ~ 400px tall       │
│   H1   Real Reviews From Real Projects.                                                          │
│   Sub  Every review is tied to a verified, completed project — never an open text box.          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS (summary band, sits directly under hero — sets context before the review grid)
────────────────────────────────────────────────────────────────────────────────────────────────
              4.8★                        X,000+                         X%
        Average Rating              Verified Reviews                 5-Star Reviews
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FILTER BAR                                                                  utility, low weight │
│   [ All ▾ ]  [ Category ▾ ]  [ City/State ▾ ]  [ Homeowner / Contractor voice ▾ ]  [ Rating ▾ ] │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  TESTIMONIALS — full grid (the page's main content)                         3-column card grid   │
│                                                                                                  │
│   ┌ [photo]{★★★★★}    ┐  ┌ [photo]{★★★★★}    ┐  ┌ [photo]{★★★★☆}    ┐                          │
│   │ "Quote..."         │  │ "Quote..."         │  │ "Quote..."         │                          │
│   │ Verified Project ✓ │  │ Verified Project ✓ │  │ Verified Project ✓ │                          │
│   │ — Name, City       │  │ — Name, Trade      │  │ — Name, City       │                          │
│   │   Kitchen Remodel  │  │   (contractor)     │  │   Roof Repair      │                          │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘                          │
│   ┌ ... ┐  ┌ ... ┐  ┌ ... ┐   (repeats, paginated — 9-12 per page)                              │
│                                                                                                  │
│                              [ Load More / Pagination ]                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  WHY REVIEWS HERE ARE DIFFERENT (feature section, explains the verification tie-in)              │
│   H2   Verified-Project Reviews Only                                                              │
│   Sub  We tie every review to a tracked, completed project — so ratings can't be gamed or        │
│        posted by anyone who never actually hired the contractor.                                 │
│                                    ┌ Learn About Trust & Safety → ┐                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← L spacing
════════════════════════════════════════════════════════════════════════════════════════════════
 FINAL CTA BAND                                                    high-contrast, full-width block
════════════════════════════════════════════════════════════════════════════════════════════════
                    ┃ Post Your Project Free → ┃      ┌ Join as a Contractor → ┐
════════════════════════════════════════════════════════════════════════════════════════════════
────────────────────────────────────────────────────────────────────────────────────────────────
 FOOTER                                                     5-column, see marketing-02-navigation.md
────────────────────────────────────────────────────────────────────────────────────────────────
```

## Hierarchy & conversion notes

- Stats sit directly under the hero, before the review grid — a summary (4.8★, X,000+ reviews) gives the visitor context for what they're about to scroll through, the same pattern review-heavy pages like Houzz use.
- The filter bar is a functional necessity here, not decoration — a homeowner researching a specific category/city needs to find relevant reviews fast, not scroll a generic, unfiltered wall of quotes.
- The "why reviews here are different" section is placed after the grid, not before — it's more convincing to let the visitor see real, attributed, verified-tagged reviews first and then explain the mechanism, rather than asking them to take the claim on faith before any proof is shown.
