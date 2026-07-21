import { Reveal } from "@/app/components/marketing/reveal";
import { SectionHeading } from "@/app/components/marketing/section-heading";
import { JobCard, type Position } from "@/app/components/careers/job-card";

const POSITIONS: Position[] = [
  {
    title: "Software Developer Intern",
    type: "Internship",
    openings: 2,
    location: "Remote",
    duration: "3–6 Months",
    doTitle: "What You'll Do",
    doItems: [
      "Build modern web applications",
      "Develop frontend and backend features",
      "Work with AI-powered functionality",
      "Collaborate with the founding team",
      "Solve real product challenges",
      "Participate in architecture discussions",
    ],
    wantTitle: "We're Looking For",
    wantItems: [
      "Strong problem-solving ability",
      "Self-driven and takes ownership",
      "Comfortable learning independently",
      "Good understanding of programming fundamentals",
      "Experience with JavaScript or TypeScript",
      "Familiarity with React or Next.js is a plus",
      "Positive attitude and willingness to grow",
    ],
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"],
  },
  {
    title: "DevOps Engineer",
    type: "Full-Time",
    openings: 1,
    location: "Remote",
    doTitle: "Responsibilities",
    doItems: [
      "Design and maintain cloud infrastructure",
      "Build CI/CD pipelines",
      "Improve system reliability",
      "Containerize applications",
      "Infrastructure automation",
      "Monitoring and logging",
      "Security best practices",
    ],
    wantTitle: "Requirements",
    wantItems: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Linux",
      "GitHub Actions",
      "Terraform is a plus",
    ],
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Linux",
      "GitHub Actions",
      "Terraform",
    ],
  },
];

/**
 * Open Positions — job cards.
 */
export function OpenPositions() {
  return (
    <section
      id="open-positions"
      aria-label="Open positions"
      className="scroll-mt-24 bg-muted/40"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Open Positions"
            title="Come build with us"
            accent="build with us"
            description="Every role here ships product. Here's where we need help right now."
          />
        </Reveal>

        <div className="mt-12 space-y-6">
          {POSITIONS.map((position, index) => (
            <Reveal key={position.title} delay={index * 100}>
              <JobCard position={position} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t see your role? We still want to meet exceptional
            builders —{" "}
            <a
              href="mailto:careers@servixa.com"
              className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              send us your resume
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
