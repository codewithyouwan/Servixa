# Trust Building Strategy

Construction is a high-stakes, high-dollar, low-frequency purchase — homeowners are trusting a stranger in their house with tens of thousands of dollars, and contractors are trusting a new platform to send them real, paying work instead of wasting their time. Trust isn't a section of the site; it has to be a thread running through every page. This document consolidates the mechanisms and where they show up.

## 1. Reviews

- **Verified-project-only reviews** (per the product spec) — every review is tied to a completed, platform-tracked project, not an open text box anyone can post to. This single fact should be stated explicitly wherever reviews appear ("Verified Project Review" badge on every review card), because it's the actual answer to "how do I know these reviews are real," which is the first thing a skeptical visitor thinks.
- **Attribution** — real name (or first name + last initial), city/state, project type, and star rating on every review card. Anonymous or vague reviews ("Great service! - J.") read as fake on a trust-sensitive site.
- **Distribution, not just concentration** — reviews live on the homepage (mixed carousel), `/reviews` (full, filterable by category/city), each contractor's public profile, and the homeowner/contractor landing pages (audience-filtered). Repetition across contexts matters more than a single impressive testimonials page.

## 2. Statistics

- Only real numbers, ever. See the homepage doc's note on section 8: at true MVP launch, "10,000+ projects" doesn't exist yet, and a marketplace caught fabricating volume stats loses far more trust than it gains from the stat itself. Until real numbers exist, use qualitative framing instead: "Now matching homeowners with contractors across [state/region]," or "Backed by [notable investor/advisor]" if applicable, or lead entirely with the verification-process trust story instead of volume.
- Once real data exists, the highest-trust stats to lead with are specifically the ones proving *quality*, not just scale: average Trust Score, average response time, completion rate — a marketplace with "500 projects, 96% completion rate" is more convincing than "50,000 projects" with no quality signal attached.

## 3. Certifications & verification

- **License verification** — state contractor license checked against the issuing state's public license database (not merely "contractor uploaded a photo of a license"). The site copy should say this plainly: "verified against state licensing records," which is a materially stronger claim than "license required."
- **Insurance verification** — liability insurance confirmed, ideally with a certificate-of-insurance check, not a self-attestation checkbox.
- **Background check** — mentioned in the product spec's "Verified Contractor Intelligence" feature; if implemented, it's one of the strongest trust claims available and deserves its own line item wherever verification is explained, not a buried sub-bullet.
- **Visual badge system** — a single consistent "Verified" badge (license + insurance + background, all three, not partial credit) used identically across the homepage, contractor profiles, and search — a badge that means different things in different places erodes rather than builds trust.

## 4. The Trust Score

- This is the platform's most defensible trust mechanism per the product spec ("Trust becomes data-driven rather than review-driven") and deserves the most explanation, not the least. The `/trust-and-safety` page should show the actual inputs (completion rate, response speed, customer retention, repeat business, dispute history) rather than presenting Trust Score as an opaque number — an unexplained score reads as marketing; an explained formula reads as accountability.
- Frame Trust Score to contractors as something that rewards good behavior (a way to stand out), and to homeowners as a shortcut past reading twenty reviews individually — same feature, two different value framings, each on its respective audience page.

## 5. Security

- For a platform handling license documents, insurance certificates, and (per the product spec) eventually payment/wallet data, a brief, plain-language security statement builds trust disproportionate to its length: "Your documents and data are encrypted and never sold to third parties." This belongs on `/trust-and-safety` and in the footer trust strip.
- Avoid vague badge-soup (generic "SSL Secured" lock icons with no context) — if there's a real security practice (SOC 2 in progress, encrypted document storage, no data resale), state it specifically; a specific claim is more convincing than a generic padlock icon that every website has regardless of actual practice.

## 6. FAQs — question bank by page

**Homeowner FAQ**
- Is it really free to post a project?
- How many contractor quotes will I get?
- What if I don't like any of the contractors I'm matched with?
- Is my contact information shared publicly?
- How are contractors verified?
- What happens if a project goes wrong?

**Contractor FAQ**
- How much does it cost to join?
- How are leads assigned to me?
- Can I choose which leads to accept?
- What if a homeowner doesn't respond after I'm matched?
- How is my Trust Score calculated?
- Can I cancel or pause my account at any time?

**General/site-wide FAQ** (on `/faq`, superset of both)
- All of the above, organized under "For Homeowners" / "For Contractors" tabs, plus:
- How does the AI Project Assistant work?
- Is my data secure?
- How do I report a problem with a contractor or homeowner?

Design decision: FAQs are split by audience (tabs or separate sections) rather than one long undifferentiated list — a contractor scrolling past ten homeowner-specific questions to find their own is friction that a simple tab structure removes for free.

## 7. Where trust elements repeat across the site

| Trust element | Homepage | Homeowner page | Contractor page | Dedicated page |
|---|---|---|---|---|
| Verification badge | Trust bar (section 2) | Why-us cards | Trust Score section | `/trust-and-safety` |
| Reviews | Mixed carousel | Homeowner-only carousel | Contractor-only carousel | `/reviews` (full, filterable) |
| Trust Score explanation | Trust deep-dive (section 9) | Trust section | Dedicated Trust Score section | `/trust-and-safety` |
| Stats | Impact band (real data only) | — | — | `/about` |
| FAQ | — | Homeowner FAQ | Contractor FAQ | `/faq` (full) |

The repetition is deliberate: a visitor rarely reads one page start to finish and converts — they bounce between the homepage, their audience page, and a trust page before deciding. Every one of those pages needs to independently answer "can I trust this," not rely on the visitor having already seen the answer elsewhere.
