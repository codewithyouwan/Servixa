# Navigation — Top Nav & Footer

## Top navigation

The nav has to serve two audiences without making either feel like an afterthought, while keeping the two primary CTAs (post a project / join as a pro) visible at all times. Pattern borrowed from Thumbtack/Houzz (dual-audience marketplace) crossed with the visual restraint of Linear/Vercel.

```
[Logo]   For Homeowners   For Contractors   AI Features   Pricing   Resources ▾   [Log In]  [Post a Project →]
```

- **Logo** — links home. Standard, no explanation needed.
- **For Homeowners / For Contractors** — top-level, not nested in a dropdown. These are the two audience landing pages and deserve equal, permanent visual weight; burying either in a dropdown signals it's secondary, which undercuts a two-sided marketplace's core message that both sides matter.
- **AI Features** — top-level, not folded into "Product." The AI Project Assistant / Trust Score / matching engine are the stated differentiator against Angi/Thumbtack/Houzz, so it gets its own nav slot rather than living inside another page.
- **Pricing** — top-level. Both homeowners (is this free?) and contractors (what does it cost to get leads?) need this answered before they'll commit, and hiding pricing behind a click erodes trust before it's even earned.
- **Resources ▾** (dropdown) — Blog, Cost Guides, FAQ, Trust & Safety, Reviews. These are trust/consideration-stage pages, not decision-stage pages, so they're appropriately one level deeper.
- **Log In** — text link, low visual weight. It's a returning-user utility, not a conversion goal for a first-time visitor.
- **Post a Project** — primary filled button, always visible, sticky on scroll. This is the single most important pixel on the site: it's the homeowner conversion goal stated in the brief. On the `/contractors` page and anywhere the visitor is contractor-flagged (referral param, or simply the page itself), this button swaps to **"Join as a Contractor"** — same visual weight, audience-appropriate label. Never show both CTAs at once in the primary nav slot; it dilutes the choice architecture and forces every visitor to read two labels instead of one.

**Mobile**: collapses to a hamburger menu with For Homeowners / For Contractors surfaced as large tappable rows at the top of the menu (not buried under "Menu"), Post a Project retained as a sticky bottom bar — mobile homeowners searching "contractor near me" convert better from a persistent bottom CTA than a top-of-page one they've scrolled past.

## Footer

Four-to-five column layout, standard for a content-rich marketplace (Airbnb/Houzz pattern) — the footer is where SEO link equity and long-tail navigation live, so it should be denser than the top nav, not a repeat of it.

**Column 1 — Company**
About · Careers · Press · Partners · Contact

**Column 2 — For Homeowners**
Post a Project · How It Works · Cost Guides · Reviews · FAQ

**Column 3 — For Contractors**
Join as a Contractor · How It Works · Pricing · Contractor Resources · FAQ

**Column 4 — Trust & Resources**
Trust & Safety · Verification Process · Blog · Sitemap

**Column 5 — Legal**
Terms of Service · Privacy Policy · Cookie Policy

**Bottom bar** (full width, below columns):
- Left: © [year] [Company name]. All rights reserved.
- Center: social icons (LinkedIn, Instagram, Facebook — where homeowners and contractors actually spend time; skip X/Twitter unless there's an active presence, a dead icon is worse than no icon)
- Right: a small trust strip — "Licensed & Insured Contractors Only" badge icon, "Secure Platform" lock icon. Repeating the trust message at the literal bottom of every single page, after the visitor has scrolled through everything else, is a deliberate last-impression reinforcement — this is the same placement Houzz and Angi use for licensing/insurance badges.

Design decision: the footer intentionally does **not** include a newsletter signup form as a primary element — for this audience (someone deciding whether to trust a marketplace with a $30k kitchen remodel), a generic "subscribe to our newsletter" ask reads as a distraction from the real conversion goal, not a value-add. If email capture is wanted, it belongs inside the Blog/Cost Guide pages as a content upgrade ("Get the full renovation cost guide"), where it has actual context.
