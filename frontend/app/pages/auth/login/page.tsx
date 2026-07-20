import type { Metadata } from "next";
import Link from "next/link";
import { LoginSignupCard } from "../../../components/auth/loginSignup";
import ThemeToggle from "../../../components/ThemeToggle";

export const metadata: Metadata = {
  title: "Log in or sign up — Servixa",
};

const TERMINAL_LINES = [
  { prompt: true, text: "servixa match --zip 90210" },
  { muted: true, text: "Parsing project brief…" },
  { text: '  "Remodel a 10x12 kitchen with new cabinets"' },
  { muted: true, text: "Scanning 12,483 verified contractors…" },
  { success: true, text: "✓ 3 licensed crews matched in your area" },
  { success: true, text: "✓ Avg. response time: 4 hours" },
  { prompt: true, text: "", caret: true },
];

const WORKFLOW_STEPS = [
  "Describe your project",
  "AI matches local crews",
  "Compare verified bids",
];

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground lg:grid lg:grid-cols-[6fr_4fr]">
      {/* Left pane — Brand Zone (60%), always dark */}
      <div className="dark relative hidden flex-col justify-between overflow-hidden bg-background p-10 text-foreground lg:flex xl:p-14">
        <div className="hero-grid absolute inset-0" aria-hidden />

        <Link href="/pages/main" className="relative flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            S
          </span>
          <span className="text-lg font-bold tracking-tight">Servixa</span>
        </Link>

        <div className="relative mx-auto w-full max-w-lg">
          <h2 className="mb-8 text-balance text-3xl font-extrabold leading-tight tracking-tight">
            Your next project,
            <br />
            <span className="text-primary">matched in minutes.</span>
          </h2>

          {/* Mock terminal — matching workflow preview */}
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-muted-foreground">
                servixa — matching engine
              </span>
            </div>
            <div className="space-y-2 p-4 font-mono text-[13px] leading-relaxed">
              {TERMINAL_LINES.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.success
                      ? "text-tea-green-400"
                      : line.muted
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }
                >
                  {line.prompt && <span className="text-primary">❯ </span>}
                  {line.text}
                  {line.caret && <span className="terminal-caret" aria-hidden />}
                </p>
              ))}
            </div>
          </div>

          {/* Workflow preview steps */}
          <ol className="mt-8 flex items-center gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {step}
                </span>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <span className="h-px w-3 bg-border" aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </div>

        <p className="relative text-xs text-muted-foreground">
          Trusted by 12,000+ licensed contractors nationwide.
        </p>
      </div>

      {/* Right pane — Action Zone (40%) */}
      <div className="relative flex flex-1 flex-col">
        {/* Compact brand strip on mobile, where the left pane is hidden */}
        <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
          <Link href="/pages/main" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              S
            </span>
            <span className="text-lg font-bold tracking-tight">Servixa</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Desktop theme switcher */}
        <div className="absolute right-6 top-6 hidden lg:block">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
          <LoginSignupCard />
        </div>
      </div>
    </div>
  );
}
