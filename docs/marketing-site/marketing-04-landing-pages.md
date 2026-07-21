# Dedicated Landing Pages

Each page below follows the homepage's principle of leading with the audience's actual objection, not a generic feature list. Sections are listed top to bottom.

---

## `/homeowners` — For Homeowners

1. **Hero** — Headline: "Get Your Home Project Done Right — Without the Guesswork." Supporting text focused on the specific homeowner pain (bad quotes, unverified pros, budget uncertainty). CTA: "Post Your Project Free →". Imagery: real renovation photo, warm and specific (kitchen or bathroom — the two most common, most photogenic project types), not a generic house exterior.
2. **Why homeowners choose us** — 4 cards: AI Project Assistant, Verified Contractors, Compare Quotes Side-by-Side, In-App Messaging & Project Tracking. Each ties a feature directly to a homeowner outcome ("compare quotes side by side" → "no more comparing a PDF to a text message").
3. **How it works** — same 3-step stepper as the homepage, but expanded with a short paragraph per step instead of one line, since this page's visitor is further into consideration.
4. **What you can build/fix** — a grid of service category icons (Kitchen, Bathroom, Roofing, HVAC, Electrical, Plumbing, Flooring, Painting, Landscaping, New Construction) each linking to a `/guides/[category]` cost-guide hub — this section does double duty as navigation and as an SEO internal-linking hub.
5. **Trust section** — condensed version of the homepage's trust deep-dive, with a direct link to `/trust-and-safety`.
6. **Homeowner testimonials only** — filtered view of the reviews carousel, homeowner voices exclusively (unlike the homepage's mixed carousel — this page's visitor wants proof from people exactly like them).
7. **FAQ** — homeowner-specific questions (Is it really free? How many quotes will I get? What if I don't like any contractor? Is my information shared publicly?) — see trust-building doc for the actual question set.
8. **Final CTA** — "Post Your Project Free →", restated once more.

---

## `/contractors` — For Contractors

1. **Hero** — Headline: "Stop Chasing Leads. Start Winning Work." Supporting text: "Get matched with homeowners who are ready to hire — not tire-kickers." CTA: "Join as a Contractor →". Imagery: a contractor actually working (not a stock handshake photo) — ideally paired with a small floating UI card showing a lead notification, mirroring the homepage hero's "show the product working" approach.
2. **The problem with other platforms** — a short, confident section naming the real contractor frustration with existing lead-gen platforms (paying for shared, low-quality, non-exclusive leads) and stating directly how this platform differs (AI-matched leads based on fit, not just who pays most). This kind of direct competitive contrast is a Thumbtack-vs-Angi-style page section and works because contractors have almost universally been burned by a lead-gen platform before — naming that shared experience builds instant rapport.
3. **What you get** — 4 cards: Matched Leads (not shared/sold to everyone), Mini CRM (lead pipeline, follow-up reminders), Portfolio Page (project gallery, before/after, testimonials), AI Proposal Drafting.
4. **How it works** — 3-step stepper (Get Verified → Receive Matched Leads → Win More Work), expanded with detail.
5. **Trust Score explained** — a section specifically explaining how a contractor's Trust Score is built (completion rate, response time, reviews) and why it benefits good contractors — framing verification as something that helps them stand out, not a hoop to jump through, is important for contractor conversion specifically.
6. **Pricing preview** — a condensed version of the contractor side of `/pricing`, with a link to the full page.
7. **Contractor testimonials only** — same filtering logic as the homeowner page.
8. **FAQ** — contractor-specific questions (What does it cost? How are leads assigned? Can I choose which leads to accept? What if a homeowner doesn't respond?).
9. **Final CTA** — "Join as a Contractor →".

---

## `/ai` — AI Features

1. **Hero** — Headline: "AI Built for Construction, Not Chatbots." Supporting text grounding the claim immediately: "Trained on real project scopes, real contractor pricing, and real outcomes — not generic web text." CTA: dual, same as homepage hero.
2. **Feature-by-feature breakdown** — one substantial section per AI capability (not a cramped grid like the homepage teaser — this page has room to actually explain):
   - **AI Project Assistant** — what it does, example input/output (a short "before: 2 sentences of rough description → after: structured scope of work card" visual), who it's for.
   - **Smart Matching Engine** — explain the actual matching factors (category, location, budget, availability, ratings, past success) as a short, specific list — specificity here is what separates this from "AI-powered matching!" marketing copy every competitor also claims.
   - **Trust Score** — same explanation as on the contractor page, reframed for a homeowner audience ("Trust Score exists so you don't have to guess who's reliable").
   - **AI Proposal Drafting** (contractor-facing) — brief mention with a link to the contractor page for detail.
3. **"How we're different" comparison** — a simple comparison table: this platform vs. traditional directories vs. generic lead-gen sites, across rows like "AI-generated project scope," "Verified-only matching," "Real-time Trust Score." Comparison tables are a well-established SaaS pattern (Vercel, Linear both use them against competitors) and work well here because "AI-powered" is an overused claim in this category — a specific, honest comparison earns more credibility than another adjective.
4. **CTA section** — dual CTA, same pattern.

---

## `/pricing` — Pricing

1. **Hero** — Headline: "Simple, Transparent Pricing." Supporting text: "Free for homeowners. Pay only for what grows your business as a contractor."
2. **Homeowner pricing block** — a single, calm card: "$0 — Post projects, compare quotes, and message contractors, always free." No asterisks, no "starting at" — for the homeowner side, ambiguity here is a trust cost, not a monetization opportunity.
3. **Contractor pricing block** — presented as tiers if the monetization model is finalized (e.g. Free / Pro / Premium), or as a single honest "Pay-per-lead + optional premium features" explanation if tiers aren't locked yet at MVP stage. Per the product spec's monetization notes (premium features free for an initial period), this section should say so plainly: "Premium features are free during our early access period" rather than implying a mature pricing ladder that doesn't exist yet at MVP — overstating pricing structure this early is a credibility risk once a contractor actually signs up and finds it different.
4. **What's included at every tier** — a comparison table (Lead access, Portfolio page, CRM, AI proposal drafting, Featured placement) so a contractor can see the full picture without contacting sales.
5. **FAQ** — pricing-specific (Do homeowners ever pay? How are lead prices determined? Can I cancel anytime? Is there a contract?).
6. **CTA** — "Post a Project Free →" / "Join as a Contractor →".

---

## `/about` — About

1. **Hero** — Headline centered on mission, not company history: "Building the World's First AI-Native Construction Marketplace." Supporting text drawn directly from the product spec's vision statement, condensed.
2. **The problem we're solving** — a short narrative section on why construction/home services is broken today (fragmented, low-trust, offline-heavy) — this is where founder story or "why we started this" content lives, which matters disproportionately for investor and press visitors specifically.
3. **Our approach** — 3-4 principles (AI-native from day one, trust as a data product, contractor success as a design input, not an afterthought) as short statement cards, not marketing fluff — this section is implicitly written for the investor/partner audience named in the brief as much as for homeowners.
4. **Roadmap/vision teaser** — a light-touch, forward-looking section referencing the phased vision (residential → global → commercial) from the product spec, without overcommitting to dates. This single section is what serves the "Investors" and "Future Partners" audiences named in the brief — they're not going to convert on `/homeowners` or `/contractors`, so `/about` needs to carry that weight.
5. **Team** (optional at MVP, include if headcount supports it) — founder photos/bios; skip entirely rather than showing a sparse, half-empty team grid, which reads worse than no team section at all.
6. **CTA** — softer than other pages: "See Open Roles →" (careers) and "Get in Touch →" (contact) alongside the standard dual CTA — About page traffic includes press/investors/partners who aren't ready to post a project or sign up, so a contact/careers path matters here specifically.

---

## `/contact` — Contact

1. **Simple header** — "We'd Love to Hear From You" — no need for a hero-scale section; contact pages perform better minimal and fast, not heavily designed.
2. **Segmented contact form** — a single dropdown at the top of the form: "I am a... Homeowner / Contractor / Brand or Partner / Press / Other" that reveals the right routing (support email vs. partnerships vs. press inbox) — a single generic contact form for five very different audiences (as named in the brief) creates internal routing chaos; solving that in the UI is cheap and prevents it.
3. **Direct info** — support email, and for partners/press specifically, a direct email rather than only a form — investors and press expect a direct line, not a ticket queue.
4. **FAQ link** — "Looking for a quick answer? Check our FAQ →" — deflects support-volume questions before they become a contact form submission.
