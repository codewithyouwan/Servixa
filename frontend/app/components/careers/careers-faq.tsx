import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";
import { FaqAccordion, type FaqItem } from "@/app/components/marketing/faq";

const CAREERS_FAQS: FaqItem[] = [
  {
    question: "Can interns work remotely?",
    answer:
      "Yes — all our current positions, including internships, are fully remote. We work async-first with a few core overlap hours for standups and pairing sessions.",
  },
  {
    question: "Will interns receive mentorship?",
    answer:
      "Absolutely. Every intern is paired with an experienced engineer from the founding team, gets regular 1:1s, code reviews on every pull request, and works on real production features — not side projects.",
  },
  {
    question: "What technologies does the team use?",
    answer:
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. Backend: NestJS with PostgreSQL. Infrastructure: AWS, Docker, and GitHub Actions. And we're AI-first — modern AI tooling is part of our daily engineering workflow.",
  },
  {
    question: "Can students apply?",
    answer:
      "Yes. Our internships are designed for students and recent graduates. We care about problem-solving ability and initiative, not your year of study — final-year students, bootcamp graduates, and self-taught developers are all welcome.",
  },
  {
    question: "What is the interview process?",
    answer:
      "Five steps: apply, resume review, a small practical technical assessment, an interview with the team, and an offer. Most candidates complete the whole process in under three weeks, and we give feedback at every stage.",
  },
];

/**
 * Careers FAQ — reuses the shared FaqAccordion.
 */
export function CareersFaq() {
  return (
    <section aria-label="Careers FAQ" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Before you apply"
            accent="you apply"
          />
        </Reveal>

        <div className="mt-10">
          <FaqAccordion items={CAREERS_FAQS} />
        </div>
      </div>
    </section>
  );
}
