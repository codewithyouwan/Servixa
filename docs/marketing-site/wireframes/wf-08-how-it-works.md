# Wireframe — How It Works (Desktop, 1440px)

See `wf-00-legend.md` for conventions. This standalone page (linked from the footer/nav "Resources") exists for the visitor who wants the full process before committing to either audience page — it presents both flows side by side via tabs, rather than repeating the condensed steppers already shown on Home/Homeowners/Contractors.

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                        ~ 400px tall       │
│   H1   How It Works                                                                              │
│   Sub  Whether you're posting a project or looking for work, here's exactly what happens.       │
│                                                                                                  │
│              [ Tabs:  ● For Homeowners     ○ For Contractors  ]                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HOMEOWNER FLOW (active tab)                                                 FEATURE SECTION     │
│                                                                                                  │
│   ①────────────────────②────────────────────③────────────────────④                            │
│   {icon} Describe          {icon} AI Builds        {icon} Get Matched      {icon} Compare &      │
│   Your Project             Your Scope              (3-5 contractors)      Choose                 │
│   [detail paragraph]       [detail paragraph]       [detail paragraph]     [detail paragraph]    │
│                                                                                                  │
│                          ┃ Post Your Project Free → ┃                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  CONTRACTOR FLOW (inactive tab — shown here for wireframe completeness)      FEATURE SECTION     │
│                                                                                                  │
│   ①────────────────────②────────────────────③────────────────────④                            │
│   {icon} Create Profile    {icon} Get Verified     {icon} Receive Leads    {icon} Win Work        │
│   [detail paragraph]       [detail paragraph]       [detail paragraph]     [detail paragraph]    │
│                                                                                                  │
│                          ┌ Join as a Contractor → ┐                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  BEHIND THE SCENES — the AI + trust layer                                    FEATURE SECTION     │
│   H2   What Happens Between Steps                                                                │
│   ┌──────────────────┐   ┌──────────────────┐                                                   │
│   │{icon} AI Matching  │   │{icon} Verification │                                                   │
│   │ Engine scores      │   │ runs before any    │                                                   │
│   │ contractor fit     │   │ contractor sees    │                                                   │
│   │                    │   │ a lead             │                                                   │
│   └──────────────────┘   └──────────────────┘                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TESTIMONIALS — process-focused quotes ("It was easier than I expected")       quiet card row
────────────────────────────────────────────────────────────────────────────────────────────────
   ┌ [photo] "From posting to first quote took less than a day." — Name, City ┐  ┌ "..." ┐
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS                                                                    number band
────────────────────────────────────────────────────────────────────────────────────────────────
        X hours                     X                             X%
   Avg. Time to First Match   Contractors per Match       Homeowners Who Hire Within a Match
────────────────────────────────────────────────────────────────────────────────────────────────
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

- Tabbed rather than stacked flows — a visitor arriving here is often still deciding which audience they are (e.g. someone who does both DIY and occasional contracting work); tabs let them check both without a full page reload or long scroll past irrelevant content.
- The "Behind the Scenes" section is unique to this page (not repeated on Home/Homeowners/Contractors) — it exists specifically for the more skeptical, detail-oriented visitor this dedicated page attracts, explaining the AI matching and verification mechanics rather than just naming them.
- Placed in the nav's "Resources" dropdown rather than the primary nav bar — it's a consideration-stage page supporting the two audience pages, not a top-level conversion destination itself.
