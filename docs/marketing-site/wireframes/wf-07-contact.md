# Wireframe — Contact (Desktop, 1440px)

See `wf-00-legend.md` for conventions.

Design note up front: contact pages convert better minimal and fast, not heavily designed (per `marketing-04-landing-pages.md`). The 8 required sections are still present below, but several are deliberately compressed to single lines rather than full feature blocks — over-building a contact page adds friction to what should be the fastest, lowest-effort page on the site.

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO (minimal, no imagery)                                                  ~ 240px tall       │
│   H1   We'd Love to Hear From You.                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────┬───────────────────────────────┐
│  CONTACT FORM (segmented)                                     │  DIRECT INFO                    │
│                                                                 │                                 │
│   I am a...  [ Homeowner ▾ ]                                   │  Support: support@[domain]      │
│      (Homeowner / Contractor / Brand or Partner / Press/Other) │  Partnerships: partners@[domain]│
│                                                                 │  Press: press@[domain]          │
│   Name       [___________________]                             │                                 │
│   Email      [___________________]                             │  {icon} Looking for a quick     │
│   Message    [___________________]                             │  answer? Check our FAQ →        │
│              [___________________]                             │                                 │
│                                                                 │                                 │
│              ┃ Send Message → ┃                                │                                 │
└──────────────────────────────────────────────────────────────┴───────────────────────────────┘
                                                                                           ← M spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TRUST REINFORCEMENT (compressed "feature section" — a quiet reassurance line, not a full block)
────────────────────────────────────────────────────────────────────────────────────────────────
   {shield} Every message is reviewed by a real person — average response time: X hours
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TESTIMONIAL (single, compressed — not a full carousel)
────────────────────────────────────────────────────────────────────────────────────────────────
   ┌ [photo] {★★★★★} "Support got back to me the same day." — Name, City ┐
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS (single-line, compressed)
────────────────────────────────────────────────────────────────────────────────────────────────
                          {clock} Avg. response time: X hours   {check} X% satisfaction rate
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← M spacing
════════════════════════════════════════════════════════════════════════════════════════════════
 CTA BAND (soft — no hard sell on a support-oriented page)
════════════════════════════════════════════════════════════════════════════════════════════════
                    Still exploring? ┌ See How It Works → ┐   ┌ Browse FAQs → ┐
════════════════════════════════════════════════════════════════════════════════════════════════
────────────────────────────────────────────────────────────────────────────────────────────────
 FOOTER                                                     5-column, see marketing-02-navigation.md
────────────────────────────────────────────────────────────────────────────────────────────────
```

## Hierarchy & conversion notes

- The segmented "I am a..." dropdown is the single most important element on this page — it solves the internal routing problem of one form serving five very different audiences (homeowners, contractors, brands/partners, press, other) named in the brief, without building five separate contact pages.
- Every "required" section below the form is deliberately compressed to one line or one card rather than a full block — this page's job is speed and directness; a contact page with a full testimonial carousel and a stats band would work against its own purpose.
- The final CTA band is intentionally soft (no "Post a Project" hard push) — someone on the contact page is typically looking for help or a specific answer, not ready to convert; redirecting them to FAQ/How It Works serves that intent better than a sales CTA.
