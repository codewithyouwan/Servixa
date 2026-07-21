import { Camera, CircleCheck, MessageSquareText } from "lucide-react";

import { FeatureSection } from "@/app/components/marketing/feature-section";

const MILESTONES = [
  { label: "Demolition & prep", done: true },
  { label: "Cabinet installation", done: true },
  { label: "Countertops & backsplash", done: false, current: true },
  { label: "Lighting & final walkthrough", done: false },
];

/**
 * Section 11 — Project Dashboard preview: milestones, photos, messages.
 */
export function DashboardPreview() {
  return (
    <FeatureSection
      eyebrow="Project Dashboard"
      title="Watch your project come to life"
      accent="come to life"
      description="After you hire, Servixa keeps working. Milestones, daily photo updates, shared files, and messages live in one dashboard — so you always know exactly where your project stands."
      bullets={[
        "Milestone tracking with clear completion states",
        "Daily progress photos from your service provider",
        "Built-in messaging — no lost texts or emails",
        "Shared documents, permits, and change orders in one place",
      ]}
      ctaLabel="See the dashboard"
      ctaHref="/pages/auth/signup"
      visualSide="left"
    >
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-blue-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Kitchen Renovation
            </p>
            <p className="text-[10px] text-muted-foreground">
              Rivera Remodeling · Started May 12
            </p>
          </div>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
            On track
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-foreground">Progress</span>
            <span className="font-bold text-primary">64%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-primary to-tea-green-500" />
          </div>
        </div>

        {/* Milestones */}
        <ul className="mt-4 space-y-2">
          {MILESTONES.map((milestone) => (
            <li
              key={milestone.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs ${
                milestone.current
                  ? "bg-secondary/50 font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <CircleCheck
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 ${
                  milestone.done
                    ? "text-primary"
                    : milestone.current
                      ? "text-primary/50"
                      : "text-border"
                }`}
              />
              {milestone.label}
              {milestone.current && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                  In progress
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Activity row */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border/70 p-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Camera aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-foreground">
                4 new photos
              </p>
              <p className="text-[9px] text-muted-foreground">Today, 2:40 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/70 p-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <MessageSquareText aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-foreground">
                2 messages
              </p>
              <p className="text-[9px] text-muted-foreground">
                “Countertops arrive Fri”
              </p>
            </div>
          </div>
        </div>
      </div>
    </FeatureSection>
  );
}
