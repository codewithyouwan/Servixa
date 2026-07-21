import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Explore Services", href: "#explore-services" },
      { label: "AI Features", href: "#ai-features" },
      { label: "How It Works", href: "/pages/main" },
      { label: "Pricing", href: "/pages/main" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/pages/main" },
      { label: "Careers", href: "/pages/careers" },
      { label: "Contact", href: "/pages/main" },
      { label: "Press", href: "/pages/main" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/pages/main" },
      { label: "Cost Guides", href: "/pages/main" },
      { label: "FAQ", href: "#faq" },
      { label: "Trust & Safety", href: "/pages/main" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/pages/main" },
      { label: "Terms of Service", href: "/pages/main" },
      { label: "Licenses", href: "/pages/main" },
    ],
  },
];

/**
 * Section 19 — Premium footer: brand block + link columns + bottom bar.
 */
export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/pages/main"
              className="flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label="Servixa home"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              >
                S
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Servixa
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI-powered construction marketplace connecting homeowners
              with verified service providers across the United States.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-xs font-semibold tracking-widest text-foreground uppercase">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Servixa, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for homeowners &amp; service providers, everywhere in the US.
          </p>
        </div>
      </div>
    </footer>
  );
}
