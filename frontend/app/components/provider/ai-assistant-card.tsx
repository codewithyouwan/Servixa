import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { PROVIDER_ROUTES } from "@/lib/provider/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Contractor-facing AI assistant (spec: "AI Construction Assistant — For
 * Contractors": proposal generation, scope creation, follow-up drafting,
 * customer communication). Entry point mirrors the homeowner dashboard's
 * AI Assistant card for product parity — both are placeholders today.
 */
const PROMPTS = [
  "Draft a proposal for the Gutter Replacement lead",
  "Write a follow-up message to a quoted homeowner",
  "Summarize this week's lead activity",
] as const;

export function ProviderAiAssistantCard() {
  return (
    <Card className="relative overflow-hidden">
      {/* Subtle premium accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/60 to-transparent"
      />
      <CardContent className="relative flex h-full flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4.5" aria-hidden />
          </div>
          <div>
            <p className="font-heading text-base font-medium">AI Assistant</p>
            <p className="text-xs text-muted-foreground">Proposals, follow-ups & summaries</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Draft proposals from an accepted lead, write follow-up messages, and get
          quick summaries of your pipeline — all in your voice, ready to send.
        </p>

        <ul className="space-y-1.5">
          {PROMPTS.map((prompt) => (
            <li key={prompt}>
              <Link
                href={PROVIDER_ROUTES.assistant}
                className="block rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
              >
                &ldquo;{prompt}&rdquo;
              </Link>
            </li>
          ))}
        </ul>

        <Button className="mt-auto w-full" render={<Link href={PROVIDER_ROUTES.assistant} />}>
          Open assistant
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </CardContent>
    </Card>
  );
}
