# Homepage — Full Structure

Design logic for the whole page before the section breakdown: a two-sided marketplace homepage has to convert two different visitors without either one feeling like they landed on the wrong site. The pattern used below — a dual-path hero, then alternating homeowner-focused and contractor-focused proof sections — is the same structural choice Thumbtack and Airbnb (host vs. guest) make. Everything above the fold is audience-neutral and value-led; the page only branches once the visitor has enough context to self-select.

---

## 1. Hero

**Purpose**: communicate the core value prop in under 5 seconds and force a fork — homeowner or contractor — without making either choice feel like a wrong turn.

**Headline**: "The AI-Powered Way to Get Your Home Project Done Right"
(Alternate, more differentiated: "Stop Guessing. Start Building — With AI-Matched, Verified Contractors.")

**Supporting text**: "Describe your project, let our AI build the scope and budget, and get matched with licensed, insured contractors in your area — free to post, no obligation."

**CTA**: Two buttons, side by side, visually equal weight but the homeowner one filled/primary and the contractor one outlined/secondary (the brief's primary goal is homeowner projects first):
- **"Post Your Project Free →"** (primary)
- **"I'm a Contractor →"** (secondary)

**Imagery**: A large hero visual split conceptually in two — not literally split-screen (which reads dated), but a single warm, real photograph of a home renovation in progress (not stock-photo sterile — Houzz's photography standard is the bar here) with a floating UI card overlay showing the AI Project Assistant mid-conversation ("What's your project?" → "Kitchen remodel" → instantly generating a scope/budget card). This does double duty: it's aspirational (a beautiful finished-feeling space) and it's proof (shows the AI product working, not just claimed).

**Icons**: none in the hero itself — icons appear starting in the trust bar below; the hero should feel like a photograph, not a UI diagram.

---

## 2. Trust bar (immediately below the fold)

**Purpose**: pre-empt the single biggest objection a construction marketplace faces — "is this legit, and are these contractors actually vetted?" — before asking for anything.

**Content**: a slim horizontal bar, no headline needed, just 4 stat/trust chips with small icons:
- 🛡️ "Licensed & Insured Verification on Every Contractor"
- ⭐ "4.8/5 Average Rating from Verified Projects"
- ✅ "[X,000]+ Projects Completed"
- 🔒 "Secure, No-Spam Project Posting"

**CTA**: none — this section's job is credibility, not conversion.

**Design decision**: placing trust signals second, before any feature explanation, mirrors Stripe's homepage logic (logo bar before "how it works") — for a marketplace handling something as high-stakes as home construction, credibility has to be established before the visitor is asked to engage with any feature.

---

## 3. Problem → Solution

**Purpose**: name the pain the target homeowner recognizes (bad quotes, unverified contractors, ghosting, scope confusion) before presenting the platform as the fix — this is what makes the value prop land as relevant rather than generic.

**Headline**: "Finding the Right Contractor Shouldn't Feel Like a Gamble"

**Supporting text**: Three short problem statements ("Quotes that don't compare apples to apples." / "Contractors who never verify their license." / "No idea if your budget is realistic.") transitioning into: "We built an AI-native marketplace to fix all three."

**Cards**: 3 icon + short-text cards, one per problem, each paired with the platform's answer underneath in a visually distinct (checkmark-styled) sub-line:
1. 📋 Unclear scope → "AI Project Assistant turns your description into a structured scope of work"
2. 🔍 Unverified pros → "Every contractor is license, insurance, and background verified"
3. 💰 Guesswork budgets → "AI-suggested budget ranges based on real project data"

**CTA**: none yet — still building the case.

---

## 4. How It Works — Homeowners

**Purpose**: remove the "what do I actually have to do" friction. This is the section that should make posting a project feel like a 3-step, low-effort action.

**Headline**: "Get Matched in 3 Simple Steps"

**Supporting text**: "No phone calls. No door-to-door quotes. Just tell us what you need."

**Cards**: 3-step horizontal stepper, numbered, each with an icon + one-line description:
1. 🗣️ **Describe Your Project** — "Tell our AI what you need — kitchen remodel, roof repair, anything."
2. 🤝 **Get Matched** — "We match you with 3–5 verified contractors based on budget, location, and availability."
3. 📊 **Compare & Choose** — "Review side-by-side quotes and pick the right pro — no pressure, no obligation."

**CTA**: "Post Your Project Free →" (primary button directly under the stepper — a visitor who's just understood the process is at peak intent right here)

**Imagery**: simple, friendly line-art illustrations (not photos) for each step — matches the lighter, "this is easy" tone the section is going for. Notion/Linear-style flat illustration, not literal screenshots (the app isn't being shown yet, per scope).

---

## 5. AI Features Spotlight

**Purpose**: make the AI differentiation tangible and specific, not a buzzword. This is the section doing the most work to differentiate against Thumbtack/Angi/Houzz, so it needs concrete detail, not "AI-powered!" marketing fluff.

**Headline**: "AI That Actually Understands Construction"

**Supporting text**: "Not a chatbot. A purpose-built assistant trained on real project scopes, real pricing, and real outcomes."

**Cards**: 4 feature cards in a grid, each with icon, short headline, one-sentence description:
1. 🧠 **AI Project Assistant** — "Turns a rough idea into a clear scope of work and budget range in seconds."
2. 🎯 **Smart Matching** — "Matches you with contractors based on skillset, availability, and track record — not just who bids fastest."
3. 📈 **Trust Score** — "Every contractor's reliability is measured by real data: response time, completion rate, and reviews."
4. 📝 **AI Proposal Drafting (for contractors)** — "Contractors get AI help writing accurate, competitive proposals fast."

**CTA**: "See AI Features →" linking to the dedicated `/ai` page (this section is a teaser, not the full explanation).

**Images/Illustrations**: a single supporting visual — a stylized "before/after" showing raw text input on one side and a structured, formatted scope-of-work card on the other. This is the clearest possible way to show what "AI-generated scope" means without requiring the visitor to imagine it.

---

## 6. How It Works — Contractors

**Purpose**: the contractor-facing mirror of section 4. Contractors are the supply side of the marketplace and the brief names "get contractors to join" as a primary goal, so this needs equal visual weight, not a smaller afterthought section.

**Headline**: "Grow Your Business With Better Leads"

**Supporting text**: "Stop chasing tire-kickers. Get matched with homeowners who are ready to hire."

**Cards**: 3-step stepper, same visual pattern as section 4 for consistency:
1. ✅ **Get Verified** — "Upload your license and insurance — takes minutes, builds instant trust with homeowners."
2. 📬 **Receive Matched Leads** — "Get project leads that fit your skills, service area, and availability."
3. 💼 **Win More Work** — "Submit quotes, message homeowners, and manage it all in one place."

**CTA**: "Join as a Contractor →" (primary button)

**Imagery**: same flat-illustration style as the homeowner steps, for visual parity between the two audiences — this consistency is intentional; giving contractors a visually "lesser" treatment than homeowners would undercut the pitch that the platform values its supply side.

---

## 7. Social Proof / Testimonials

**Purpose**: third-party validation, in both audiences' voices — a homeowner-only testimonial section would make contractors feel like an afterthought, and vice versa.

**Headline**: "Trusted by Homeowners and Contractors Alike"

**Cards**: a carousel or 2x2 grid of quote cards — mix of homeowner and contractor testimonials, each with name, city/state, project type or trade, star rating, and (where possible) a real photo — avoid stock headshots, which read as fake on trust-sensitive marketplaces (this is a lesson from how Houzz and Thumbtack present reviews: specific, attributed, photographed).

**Supporting element**: below the carousel, a link — "Read all reviews →" to `/reviews`.

**CTA**: none primary; this section's job is belief, not action.

---

## 8. Stats / Impact band

**Purpose**: reinforce scale and momentum — for a marketplace, "other people are already here" reduces the perceived risk of being an early/lonely user.

**Headline**: none needed — a clean stat band, similar to Stripe's homepage numbers.

**Content**: 4 large numbers with small labels underneath:
- "[X,000]+ Projects Posted"
- "[X,000]+ Verified Contractors"
- "$[X]M+ in Projects Matched"
- "4.8★ Average Contractor Rating"

**Note**: at true MVP launch, these numbers won't exist yet — this section should either be held back until there's real data to show, or reframed around mission/coverage ("Now serving homeowners across [state/region]") rather than fabricated volume metrics. Fabricated stats are a trust liability precisely on the page whose job is building trust.

---

## 9. Trust & Verification deep-touch

**Purpose**: a second, more detailed trust section — the first trust bar (section 2) was a teaser; this is where the platform explains *how* verification actually works, for the visitor who needs more than a badge to be convinced.

**Headline**: "Real Verification. Real Accountability."

**Supporting text**: "Every contractor on our platform goes through license verification, insurance checks, and background review — before they ever see a lead."

**Cards**: 3 cards:
1. 📄 **License Verified** — "We confirm active state licensing before approval."
2. 🛡️ **Insurance Confirmed** — "Liability insurance is verified, not just self-reported."
3. 📊 **Trust Score Tracked** — "Ongoing performance — response time, completion rate, reviews — feeds a live Trust Score, not a one-time check."

**CTA**: "Learn About Trust & Safety →" linking to `/trust-and-safety`.

---

## 10. Pricing teaser

**Purpose**: answer "is this free?" without requiring a click — friction at this question kills trust for both audiences.

**Headline**: "Free for Homeowners. Simple Pricing for Contractors."

**Supporting text**: one line per audience: "Posting a project and getting quotes is always free for homeowners." / "Contractors pay only for the leads and features that grow their business."

**CTA**: "See Full Pricing →" linking to `/pricing`.

**Imagery**: none needed — this is a text-led, low-visual-weight section; over-designing a pricing teaser invites scrutiny before the full pricing page can properly frame it.

---

## 11. Blog / Resources teaser

**Purpose**: signal that the platform is a genuine resource, not just a lead-gen funnel — and surface the SEO content that's driving a meaningful share of organic traffic (see SEO doc).

**Headline**: "Plan Smarter With Our Project Guides"

**Cards**: 3 featured article cards (e.g. "2026 Kitchen Remodel Cost Guide," "How to Vet a Contractor's License," "What to Expect From a Roof Replacement"), each with a thumbnail image, title, and one-line description.

**CTA**: "Browse All Guides →" linking to `/blog` or `/cost-guides`.

---

## 12. Final CTA band

**Purpose**: the last chance to convert a visitor who's read the whole page — needs to be unmissable and unambiguous, restating the fork from the hero now that the visitor has full context.

**Headline**: "Ready to Get Started?"

**Supporting text**: "Join thousands of homeowners and contractors building smarter, together."

**CTA**: two buttons again, same as the hero — "Post Your Project Free →" and "Join as a Contractor →" — full-width, high-contrast section (often a dark or brand-color background block, per Linear/Vercel convention for a page's final CTA) so it visually reads as the page's closing statement, not another content section.

---

## Section order rationale (summary)

Hero → Trust bar → Problem/Solution → Homeowner steps → AI Spotlight → Contractor steps → Testimonials → Stats → Trust deep-dive → Pricing teaser → Blog teaser → Final CTA.

The ordering front-loads trust (sections 2 and 9 bookend the page, not just the top) because that's the single biggest barrier for this category, alternates homeowner- and contractor-facing content rather than blocking all of one audience's content together (so neither audience has to scroll past a wall of "not for me" content to find their section), and holds pricing until after value has been established — asking "what does this cost" to land before the visitor understands what they're paying for invites a bounce.
