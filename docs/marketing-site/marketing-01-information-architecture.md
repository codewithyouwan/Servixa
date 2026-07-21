# Marketing Website — Information Architecture

Scope: the **public marketing site only** — no dashboards, no authenticated screens. Every page below exists to do one of three jobs: convert a homeowner into a posted project, convert a contractor into a signup, or build enough trust that a visitor believes the platform is safe to use before they'll do either. Login and Sign Up are gateway pages that hand off to the product app — their design is out of scope here, but their placement in the IA isn't.

## Full page list

**Core conversion pages**
- `/` — Home
- `/homeowners` — For Homeowners
- `/contractors` — For Contractors
- `/ai` — AI Features
- `/pricing` — Pricing

**Trust & credibility**
- `/about` — About / Company story
- `/how-it-works` — How It Works (can be a standalone page linked from nav, with homeowner/contractor tabs, in addition to living inside the two audience pages)
- `/trust-and-safety` — Trust & Safety (verification, licensing, insurance, Trust Score explained)
- `/reviews` — Reviews & Testimonials (aggregated, filterable by service category/city)
- `/contractors/directory` — Browse Contractors (a light, SEO-facing preview of the marketplace — city/category landing pages, not the authenticated search experience)

**Conversion support**
- `/contact` — Contact
- `/faq` — FAQ
- `/blog` — Blog / Resource Hub
- `/blog/[slug]` — individual articles
- `/guides/[city]/[category]` — programmatic local SEO pages (e.g. "Kitchen Remodel Cost in Austin, TX") — see SEO doc
- `/cost-guides` — Cost Guide hub (index of the above)

**Company / investor / partner facing**
- `/careers` — Careers (even a single "we're hiring, here's our story" page builds legitimacy for a marketplace asking contractors to trust it)
- `/partners` — For Partners (brands, suppliers, associations — light-touch page capturing inbound interest ahead of the Phase 2 brand product)
- `/press` — Press / Media Kit (logos, founder bios, boilerplate — investors and journalists both look for this)

**Legal / utility (required, low-design-effort)**
- `/terms`
- `/privacy`
- `/sitemap` (HTML sitemap, distinct from XML sitemap for SEO)

**Auth gateways (out of scope for visual design, listed for IA completeness)**
- `/login`
- `/signup` — should branch immediately: "I'm a homeowner" / "I'm a contractor," since the two signup flows and value props are entirely different.

## Why this shape

A generic SaaS IA (Home, Product, Pricing, About, Contact) under-serves a two-sided marketplace: homeowners and contractors are different audiences with different objections, so each gets its own landing page rather than being a section within a single "Product" page — this is the same pattern Thumbtack and Houzz use, and it's necessary here specifically because the CTAs are different ("Post a project" vs. "Join as a pro").

The cost-guide / city-category pages and the trust-and-safety page are the two additions a generic marketing-site template wouldn't include by default, and they're the two doing the most work for this specific business: local cost-guide pages are the highest-leverage organic traffic play for a construction marketplace (this is exactly how Thumbtack and Houzz built SEO moats), and a dedicated trust page matters more here than for most SaaS products because the product spec's core differentiator is "trust becomes data-driven rather than review-driven" — that claim needs a page, not a footnote.
