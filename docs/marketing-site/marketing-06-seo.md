# SEO Strategy — Organic Traffic Pages

Construction/home-services is one of the highest-intent, highest-volume local-search categories on the internet ("contractor near me," "[project] cost," "how to find a licensed electrician") — this is exactly the SEO playbook Houzz, Thumbtack, and Angi were built on, and it's available here for the same reason: homeowners research heavily before hiring, which means there's a large body of informational search intent to capture before the transactional "hire someone" moment.

## 1. Programmatic local + category pages (highest leverage)

The single highest-volume opportunity: `/guides/[city]/[category]` pages — e.g. "Kitchen Remodel Cost in Austin, TX," "How Much Does a Roof Replacement Cost in Denver?" Each page combines:
- A localized cost range (tied to the AI Project Cost Estimator data described in the product spec, once that data exists — pre-launch, use industry-average ranges with a clear "estimate" disclaimer)
- What's typically included in that project type
- What affects price (materials, size, region)
- A directory-style preview of verified contractors in that city/category (public preview only — links into the authenticated search experience for full detail)
- CTA: "Get Free Quotes for Your [Category] Project in [City] →"

This is a template, generated at scale across (top 50–100 US metro areas) × (10–15 core service categories from the product spec: kitchen, bathroom, roofing, HVAC, plumbing, electrical, painting, flooring, landscaping, new construction). That's 500-1,500 pages from one template — the same approach Thumbtack and Houzz use to dominate long-tail local search, and it's the highest-ROI SEO investment on this list because each page targets a specific, high-intent, comparatively low-competition search query (city + category combinations are far less contested than generic "contractor" searches).

**Caution**: thin, near-duplicate programmatic pages get penalized by search engines. Each page needs genuinely distinct content per city (real local pricing data, not the same paragraph with the city name swapped), which is a real content/data investment, not just a template — this is a build-later, not a launch-day, priority, sequenced after there's enough project data to make the city-level pricing genuinely accurate rather than guessed.

## 2. Cost guide hub (`/cost-guides`)

A less granular, launch-ready alternative/precursor to the programmatic pages above: one solid, well-researched guide per service category (not per city) — "2026 Kitchen Remodel Cost Guide," "Bathroom Renovation Cost Guide," etc. These target "[project] cost" queries nationally, which are extremely high volume, and can launch on day one without needing city-level data. This is the right starting point before the programmatic city×category expansion in §1.

## 3. Blog / editorial content

Longer-form, less templated content targeting research-stage and comparison-stage queries:
- "How to Verify a Contractor's License in [State]" (ties directly to the platform's verification differentiator)
- "Questions to Ask Before Hiring a Contractor"
- "AI in Construction: What Homeowners Should Know" (ties to the AI differentiator, and captures interest-stage search volume around AI + home improvement, a genuinely growing search category)
- "How to Read and Compare Contractor Quotes"
- Seasonal/timely pieces ("Spring Home Maintenance Checklist," "Preparing Your Roof for Winter") — these have reliable, recurring seasonal search demand and are cheap to refresh year over year.

## 4. Comparison / vs. pages

"[Platform] vs. Thumbtack," "[Platform] vs. Angi," "[Platform] vs. Houzz" — visitors actively comparing platforms search these terms directly, and owning the page means controlling the narrative instead of ceding it to a review-aggregator site's take. Requires care to stay factual and non-disparaging (a comparison page that's obviously biased marketing undercuts the same trust the rest of the site is building) — lead with honest, verifiable differences (AI-native matching, Trust Score) rather than generic superiority claims.

## 5. Trade/contractor-facing SEO

The brief also names contractors as a target audience for organic acquisition, not just homeowners:
- "How to Get More Contractor Leads in [State/City]"
- "Contractor License Requirements in [State]" (a genuinely useful, non-promotional resource that also captures contractors actively researching licensing — often a moment when they're also evaluating which platforms to join)
- "[Trade] Business Growth Tips" (e.g. "How Electricians Can Grow Their Business Online")

## 6. FAQ page as a schema/SEO asset

`/faq`, structured with FAQ schema markup (structured data), is a legitimate SEO asset on its own — FAQ-schema pages are eligible for rich snippets in search results, and questions like "is it free to hire a contractor through [platform]" or "how do I verify a contractor's license" carry real, if modest, direct search volume.

## 7. Technical/on-page fundamentals (not pages, but prerequisites)

- Every landing page (`/homeowners`, `/contractors`, `/ai`, `/pricing`) needs unique, keyword-relevant title tags and meta descriptions — not a shared template.
- XML sitemap covering all public pages, submitted to Search Console, updated automatically as cost-guide/blog pages are added.
- Structured data: LocalBusiness/Organization schema site-wide, Review schema on testimonial content, FAQPage schema on `/faq`.
- Core Web Vitals matter directly here since Next.js is the frontend framework — static generation (SSG) or ISR for the cost-guide and blog pages specifically (they're content, not dynamic app state, and are exactly the kind of page Next.js's static rendering is built for) keeps them fast, which is both a ranking factor and a trust signal (a slow site reads as an unreliable business).

## Priority sequencing (launch → growth)

1. **Launch**: core pages (Home, Homeowners, Contractors, AI, Pricing, About, Contact, FAQ) with solid on-page SEO fundamentals, plus the category-level cost guide hub (§2) — no city data needed.
2. **Early growth**: blog/editorial content (§3), comparison pages (§4), contractor-facing SEO (§5) — content investment, not data-dependent.
3. **Scale** (once there's real project/pricing data): programmatic city×category pages (§1) — the highest-ceiling channel, but sequenced last because it depends on data the platform doesn't have on day one, and premature launch of thin, inaccurate city pages would do more SEO harm than good.
