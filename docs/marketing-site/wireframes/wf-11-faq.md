# Wireframe — FAQ (Desktop, 1440px)

See `wf-00-legend.md` for conventions. FAQ is a dense, scan-first page — spacing is tighter (S, not M) throughout, since scanability matters more than drama here.

```
════════════════════════════════════════════════════════════════════════════════════════════════
 HEADER / NAV                                                                    sticky · 72px
────────────────────────────────────────────────────────────────────────────────────────────────
 {Logo}      For Homeowners   For Contractors   AI Features   Pricing   Resources ▾      Log In   ┃ Post a Project → ┃
════════════════════════════════════════════════════════════════════════════════════════════════
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  HERO                                                                        ~ 320px tall       │
│   H1   Frequently Asked Questions                                                                │
│   [ Search FAQs...  🔍 ]                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  AUDIENCE TABS                                                               utility, low weight │
│              [ ● For Homeowners     ○ For Contractors     ○ General ]                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FAQ ACCORDION — Homeowners (active tab)                                     dense, scan-first   │
│                                                                                                  │
│   ▸ Is it really free to post a project?                                                          │
│   ▸ How many contractor quotes will I get?                                                        │
│   ▾ What if I don't like any of the contractors I'm matched with?                                 │
│      [ expanded answer text — 2-3 sentences ]                                                     │
│   ▸ Is my contact information shared publicly?                                                    │
│   ▸ How are contractors verified?                                                                 │
│   ▸ What happens if a project goes wrong?                                                          │
│   ▸ How does the AI Project Assistant work?                                                        │
│   ▸ Is my data secure?                                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FAQ ACCORDION — Contractors (inactive, shown for wireframe completeness)                        │
│   ▸ How much does it cost to join?                                                                 │
│   ▸ How are leads assigned to me?                                                                  │
│   ▸ Can I choose which leads to accept?                                                            │
│   ▸ What if a homeowner doesn't respond after I'm matched?                                         │
│   ▸ How is my Trust Score calculated?                                                              │
│   ▸ Can I cancel or pause my account at any time?                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← M spacing
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  FEATURE SECTION — "still have questions" trust reinforcement                                    │
│   H2   Didn't Find Your Answer?                                                                   │
│   {icon} Real support team   {icon} Avg. response time: X hours                                  │
│                                    ┌ Contact Us → ┐                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 TESTIMONIAL (single, compressed — reassurance that support is real/responsive)
────────────────────────────────────────────────────────────────────────────────────────────────
   ┌ [photo] "They answered my question within the hour." — Name, City ┐
────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                           ← S spacing
────────────────────────────────────────────────────────────────────────────────────────────────
 STATISTICS (compressed, single line)
────────────────────────────────────────────────────────────────────────────────────────────────
                          {clock} X hr avg. response   {check} X% questions resolved on first contact
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

- Search bar in the hero, not buried lower — FAQ visitors typically arrive with one specific question; letting them search directly beats making them scan a long tabbed accordion, especially once the question bank grows.
- Tabs (Homeowners / Contractors / General) rather than one long undifferentiated list — a contractor scrolling past ten homeowner-specific questions to find their own is friction a simple tab removes for free, same logic as the `marketing-05-trust-building.md` FAQ design decision.
- Testimonial and stats sections are compressed to single lines here (same treatment as the Contact page) — an FAQ page's job is fast answers, not persuasion; over-building these sections would work against the page's purpose.
