import { Star } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  tone: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initials: "MK",
    name: "Melissa Kane",
    role: "Homeowner",
    company: "Austin, TX",
    rating: 5,
    comment:
      "I typed one sentence about my kitchen and got a full scope of work, a realistic budget, and three verified remodelers by the next morning. This is how hiring should work.",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    initials: "DR",
    name: "Dan Reyes",
    role: "Owner",
    company: "Rivera Remodeling",
    rating: 5,
    comment:
      "The leads are pre-scoped and budget-qualified before they reach me. My close rate doubled in three months — I've stopped buying leads anywhere else.",
    tone: "bg-accent text-accent-foreground",
  },
  {
    initials: "AP",
    name: "Aisha Patel",
    role: "Homeowner",
    company: "Denver, CO",
    rating: 5,
    comment:
      "Comparing quotes side by side saved me from a bid that quietly excluded materials. The AI flagged it instantly. Worth it for that alone.",
    tone: "bg-space-indigo-100 text-space-indigo-700",
  },
  {
    initials: "JW",
    name: "James Whitfield",
    role: "Master Electrician",
    company: "Volt & Vine Electric",
    rating: 4,
    comment:
      "Verification actually means something here. Homeowners trust the platform, so they trust us — first calls start warmer than any other channel we use.",
    tone: "bg-blue-slate-100 text-blue-slate-700",
  },
  {
    initials: "SL",
    name: "Sofia Lindqvist",
    role: "Homeowner",
    company: "Phoenix, AZ",
    rating: 5,
    comment:
      "The project dashboard kept our roof replacement completely transparent — daily photos, milestones, messages. I never once had to ask 'what's happening?'",
    tone: "bg-tea-green-100 text-tea-green-800",
  },
  {
    initials: "CB",
    name: "Carlos Bautista",
    role: "Founder",
    company: "SummitPeak Roofing",
    rating: 5,
    comment:
      "We onboarded, got verified, and won our first project in nine days. The AI proposal drafts alone save my office hours every week.",
    tone: "bg-mineral-teal-100 text-mineral-teal-800",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:w-[380px]">
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "fill-warning text-warning"
                : "text-border"
            }`}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/85">
        “{testimonial.comment}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${testimonial.tone}`}
        >
          {testimonial.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Section 12 — Testimonials: auto-scrolling horizontal marquee of large
 * cards (pauses on hover; static duplicate list is aria-hidden).
 */
export function Testimonials() {
  return (
    <section aria-label="Testimonials" className="scroll-mt-24 overflow-hidden bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Homeowners and pros, both winning"
            accent="both winning"
            description="Real outcomes from both sides of the marketplace."
          />
        </Reveal>
      </div>

      <div className="marquee-hover-pause pb-16 md:pb-24">
        <div className="animate-marquee-slow flex w-max gap-5 pr-5">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
          {/* Duplicate for seamless loop */}
          <div aria-hidden="true" className="contents">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard
                key={`${testimonial.name}-dup`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
