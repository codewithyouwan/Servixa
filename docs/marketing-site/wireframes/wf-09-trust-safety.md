# Wireframe — Trust & Safety (Desktop, 1440px)

See `wf-00-legend.md` for conventions.

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO (calm, quiet — no urgency, this page's tone is reassurance, not conversion)  ~ 400px       │
│   H1   Real Verification. Real Accountability.                                                   │
│   Sub  Every contractor is verified before they ever see a project. Here's exactly how.         │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  VERIFICATION PROCESS                                                        FEATURE SECTION     │
│   H2   What We Check, Before Any Contractor Goes Live                                            │
│   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐                           │
│   │{icon} License      │   │{icon} Insurance    │   │{icon} Background   │                           │
│   │ Verified against   │   │ Confirmed, not     │   │ Checked            │                           │
│   │ state records      │   │ self-reported      │   │                    │                           │
│   └──────────────────┘   └──────────────────┘   └──────────────────┘                           │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  TRUST SCORE — the inputs, explained                                         FEATURE SECTION     │
│   H2   Trust Score Is Data, Not a Popularity Contest                                              │
│   [ visual: composite gauge broken into labeled segments ]                                        │
│   {icon} Completion Rate   {icon} Response Speed   {icon} Customer Retention   {icon} Dispute History │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  SECURITY                                                                    FEATURE SECTION     │
│   H2   Your Data Is Protected                                                                     │
│   Sub  Documents and personal data are encrypted and never sold to third parties.                │
│   ┌──────────────────┐   ┌──────────────────┐                                                   │
│   │{icon} Encrypted    │   │{icon} No Data      │                                                   │
│   │ Document Storage   │   │ Resale             │                                                   │
│   └──────────────────┘   └──────────────────┘                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  BADGE SYSTEM                                                                FEATURE SECTION     │
│   H2   What Our Badges Mean                                                                       │
│   {shield} Verified — license + insurance + background, all three, always                        │
│   {star} Top Rated — sustained high Trust Score over time                                        │
│   {flag} Platform Added — profile created by our team during early bootstrap, pending contractor  │
│           claim (per the manual-entry supply strategy)                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TESTIMONIALS — trust-specific framing ("I felt safe letting them into my home")
────────────────────────────────────────────────────────────────────────────────────────────────
   ┌ [photo] {★★★★★} "Knowing they were licensed and insured made the decision easy." — Name ┐
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS (verification-specific, quality signals not volume)                number band
────────────────────────────────────────────────────────────────────────────────────────────────
        100%                        X%                            X%
   Contractors License-Checked   Insurance Confirmation Rate   Projects Completed as Scoped
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FAQ (trust/safety-specific, accordion)                                      low visual weight   │
│   ▸ How do you verify a contractor's license?                                                     │
│   ▸ What happens if a contractor's insurance lapses?                                              │
│   ▸ How is Trust Score calculated?                                                                 │
│   ▸ How do I report a problem?                                                                     │
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

- No heavy-border CTA until the final band — everywhere else on this page is deliberately calm, low-contrast, and text/detail-forward, since the whole point of this page is that trust is earned through specificity, not sold through a big button. A pushy CTA mid-page would undercut the tone the page is trying to establish.
- Trust Score is shown as a broken-out, labeled gauge rather than a single opaque number — an explained formula reads as accountability; an unexplained score reads as marketing, which is the exact distinction this page exists to make.
- Statistics here are quality signals (license-check rate, completion accuracy) rather than volume metrics (total projects) — this page's job is proving rigor, not scale.
