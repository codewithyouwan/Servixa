"use client";

import { CheckCircle2, ClipboardList, ListChecks, MapPin, Sparkles, Wallet } from "lucide-react";

import type { ProjectDraft } from "@/lib/homeowner/services/ai-assistant-service";

function formatBudget(min: number, max: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min || max);
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ListChecks;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-draft-in space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

/**
 * Live project card — fills in as the AI assistant collects details.
 * Every field comes from the same server turn that produced the
 * assistant's last message, so this can never drift out of sync with
 * the conversation.
 */
export function ProjectDraftPanel({ draft }: { draft: ProjectDraft }) {
  const budget = formatBudget(draft.budgetMin, draft.budgetMax);
  const isEmpty =
    !draft.title && !draft.summary && draft.scope.length === 0 && draft.collected.length === 0;

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/70 p-5">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Your project</h2>
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {draft.progress}%
          </span>
        </div>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={draft.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Project details collected"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${draft.progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {isEmpty ? (
          <>
            <p className="text-sm leading-relaxed text-muted-foreground">
              As you describe your project, I&apos;ll build it out here — scope, a typical plan of
              work, and an estimated budget.
            </p>
            {draft.pincode && (
              <div className="animate-draft-in space-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {draft.address || draft.pincode}
                </span>
                <p className="text-xs text-muted-foreground">
                  Job location from your profile — mention a different ZIP in chat to change it.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {draft.title && (
              <div className="animate-draft-in space-y-1">
                <h3 className="text-base leading-snug font-semibold text-foreground">
                  {draft.title}
                </h3>
                {draft.categoryLabel && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {draft.categoryLabel}
                  </span>
                )}
              </div>
            )}

            {draft.summary && (
              <p className="animate-draft-in text-sm leading-relaxed text-muted-foreground">
                {draft.summary}
              </p>
            )}

            {(draft.pincode || budget) && (
              <div className="animate-draft-in flex flex-wrap gap-4 text-sm">
                {draft.pincode && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                    {draft.address || draft.pincode}
                  </span>
                )}
                {budget && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Wallet aria-hidden="true" className="h-3.5 w-3.5" />
                    {budget}
                    <span className="text-xs">est.</span>
                  </span>
                )}
              </div>
            )}

            {draft.scope.length > 0 && (
              <Section icon={ListChecks} title="Scope of work">
                <ul className="space-y-1.5">
                  {draft.scope.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {draft.plan.length > 0 && (
              <Section icon={ClipboardList} title="How it typically goes">
                <ol className="space-y-2">
                  {draft.plan.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-muted text-[0.65rem] font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {draft.collected.length > 0 && (
              <Section icon={CheckCircle2} title="Details">
                <dl className="space-y-1.5">
                  {draft.collected.map((f) => (
                    <div key={f.name} className="flex justify-between gap-3 text-sm">
                      <dt className="text-muted-foreground">{f.name}</dt>
                      <dd className="text-right font-medium text-foreground">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
