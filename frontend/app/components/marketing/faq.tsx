import { ChevronDown } from "lucide-react";

import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Is it really free to post a project?",
    answer:
      "Yes. Posting a project, getting AI-generated scopes, and receiving quotes from verified service providers is completely free for homeowners. You only pay the professional you hire, directly.",
  },
  {
    question: "How are service providers verified?",
    answer:
      "Every provider passes license verification, insurance verification, and business checks before they can receive leads. Their ongoing Trust Score reflects completion rate, response speed, and verified project reviews.",
  },
  {
    question: "How does the AI matching work?",
    answer:
      "The matching engine compares your project's scope, budget, location, and timeline against each provider's skills, availability, past project success, and ratings — then routes your project to a small set of best-fit professionals.",
  },
  {
    question: "How many quotes will I receive?",
    answer:
      "Typically three to five standardized quotes. We intentionally limit distribution so you get thoughtful responses from well-matched pros instead of a flood of cold calls.",
  },
  {
    question: "I'm a service provider — what does it cost to join?",
    answer:
      "Creating a profile and getting verified is free during our launch phase. You'll receive matched leads, a mini-CRM, and AI proposal tools. Premium placement and subscriptions arrive later.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We're live across the United States for residential projects, with the deepest provider coverage in major metros. Enter your ZIP when posting and we'll show you real availability.",
  },
];

/**
 * Reusable accordion list built on native details/summary.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((faq, index) => (
        <Reveal key={faq.question} delay={index * 60}>
          <details className="group rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-sm font-semibold text-foreground outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Section 16 — homepage FAQ.
 */
export function Faq() {
  return (
    <section id="faq" aria-label="Frequently asked questions" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            accent="answered"
          />
        </Reveal>

        <div className="mt-10">
          <FaqAccordion items={FAQS} />
        </div>
      </div>
    </section>
  );
}
