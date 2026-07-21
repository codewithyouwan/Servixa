# Wireframe — Blog / Cost Guide Hub (Desktop, 1440px)

See `wf-00-legend.md` for conventions. This is the index/hub page (`/blog` and `/cost-guides` share this layout pattern) — the template that individual articles/guides render into is a separate, lighter-weight page not detailed here (per the earlier scope decision to wireframe hub/template pages, not every individual article).

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                        ~ 360px tall       │
│   H1   Plan Smarter With Our Project Guides                                                      │
│   Sub  Real cost data, contractor vetting tips, and project planning resources.                  │
│   [ Search guides...  🔍 ]                                                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY FILTER BAR                                                         utility, low weight │
│   [All] [Kitchen] [Bathroom] [Roofing] [HVAC] [Electrical] [Plumbing] [Flooring] [Painting] ...  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FEATURED GUIDE (large, single card — highest-traffic or newest content)     FEATURE SECTION     │
│   ┌────────────────────────────────────────────────────────────────────┐                       │
│   │ [ IMG: hero photo ]     H2  2026 Kitchen Remodel Cost Guide          │                       │
│   │                          Sub  What to expect, by size and finish     │                       │
│   │                          ┌ Read Guide → ┐                            │                       │
│   └────────────────────────────────────────────────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  GUIDE / ARTICLE GRID (main content)                                         3-column card grid  │
│                                                                                                  │
│   ┌ [thumb]            ┐  ┌ [thumb]            ┐  ┌ [thumb]            ┐                        │
│   │ Bathroom Reno Cost │  │ How to Vet a       │  │ Roof Replacement   │                        │
│   │ Guide               │  │ Contractor License │  │ Cost Guide          │                        │
│   │ [category tag]      │  │ [category tag]     │  │ [category tag]      │                        │
│   └────────────────────┘  └────────────────────┘  └────────────────────┘                        │
│   ┌ ... ┐  ┌ ... ┐  ┌ ... ┐   (repeats, paginated)                                              │
│                                                                                                  │
│                              [ Load More / Pagination ]                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  BROWSE BY PROJECT TYPE (SEO internal link grid)                             FEATURE SECTION     │
│   {icon}Kitchen  {icon}Bathroom  {icon}Roofing  {icon}HVAC  {icon}Electrical  {icon}Plumbing      │
│   {icon}Flooring {icon}Painting  {icon}Landscape {icon}New Construction                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TESTIMONIALS — "the guide helped me" framing
────────────────────────────────────────────────────────────────────────────────────────────────
   ┌ [photo] "The cost guide helped me spot a lowball quote." — Name, City ┐  ┌ "..." ┐
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS
────────────────────────────────────────────────────────────────────────────────────────────────
        X00+                        X,000+                        X
   Guides Published             Monthly Readers              Project Categories Covered
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← L spacing
════════════════════════════════════════════════════════════════════════════════════════════════
 FINAL CTA BAND                                                    high-contrast, full-width block
════════════════════════════════════════════════════════════════════════════════════════════════
              H2  Ready to Get Quotes for Your Project?
                    ┃ Post Your Project Free → ┃      ┌ Join as a Contractor → ┐
════════════════════════════════════════════════════════════════════════════════════════════════
────────────────────────────────────────────────────────────────────────────────────────────────
 FOOTER                                                     5-column, see marketing-02-navigation.md
────────────────────────────────────────────────────────────────────────────────────────────────
```

## Hierarchy & conversion notes

- A featured-guide hero card sits above the general grid — gives editorial control over which content gets top placement (newest, highest-converting, or most seasonally relevant guide), the same pattern most content hubs (including Houzz's Ideabooks) use rather than a purely reverse-chronological feed.
- The "Browse by Project Type" icon grid duplicates the one on the Homeowners page intentionally — it's the same SEO internal-linking mechanism, and repeating it here catches visitors who arrived directly at the blog via search rather than through the homeowner funnel.
- Every individual guide/article ends with a category-specific CTA ("Get Free Quotes for This [Category] Project," per `marketing-07-cta-strategy.md`) rather than the generic hub-level CTA shown here — that page-level detail belongs in the article template, not this hub wireframe.
