import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PROMPTS = [
  "Estimate the cost of a bathroom remodel",
  "Turn my project idea into a scope of work",
  "What permits do I need for a roof replacement?",
] as const;

export function AiAssistantCard() {
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
            <p className="font-heading text-base font-medium">AI Project Assistant</p>
            <p className="text-xs text-muted-foreground">Scopes, budgets & briefs in seconds</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Describe what you want done — the assistant turns it into a structured scope of
          work, suggests a budget range, and drafts a brief for contractors.
        </p>

        <ul className="space-y-1.5">
          {PROMPTS.map((prompt) => (
            <li key={prompt}>
              <Link
                href={ROUTES.assistant}
                className="block rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
              >
                &ldquo;{prompt}&rdquo;
              </Link>
            </li>
          ))}
        </ul>

        <Button className="mt-auto w-full" render={<Link href={ROUTES.assistant} />}>
          Start planning
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      </CardContent>
    </Card>
  );
}
