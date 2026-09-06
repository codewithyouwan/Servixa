"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Send, Sparkles, User as UserIcon } from "lucide-react";

import { ProjectDraftPanel } from "@/app/components/dashboard/project-draft-panel";
import { useAuth } from "@/app/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import {
  AiAssistantService,
  EMPTY_DRAFT,
  type ProjectDraft,
} from "@/lib/homeowner/services/ai-assistant-service";
import type { Project } from "@/lib/homeowner/types";
import { ApiError } from "@/lib/types";

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

const GREETING =
  "Hi! Tell me what you need done — the type of work, roughly where, and any details you have — and I'll get your project posted for quotes.";

/** Mirrors backend _profile_location(): the saved profile address is the
 *  default job location, shown up front so the user knows what will be
 *  used and can override it in chat. */
function profileLocation(address?: {
  line1?: string;
  city: string;
  state: string;
  postalCode: string;
}): { zip: string; label: string } | null {
  const zip = address?.postalCode?.match(/\d{5}/)?.[0];
  if (!zip || !address) return null;
  const parts = [address.line1, address.city, address.state].filter(Boolean).join(", ");
  return { zip, label: parts ? `${parts} ${zip}` : zip };
}

const SUGGESTIONS = [
  "My AC stopped cooling",
  "Kitchen sink is leaking",
  "Need my 2BHK deep cleaned",
];

/**
 * AI Project Assistant — conversational project intake with a live
 * project card. Talks to POST /ai/project-assistant; each turn returns
 * both the assistant's reply and the rebuilt draft, so the panel and
 * the chat always agree.
 */
export default function AssistantPage() {
  const { user } = useAuth();
  const profile = useMemo(() => profileLocation(user?.address), [user]);

  // The greeting and the seeded draft are derived (not state) because the
  // user's profile loads async — this way they fill in whenever it lands.
  const greeting = profile
    ? `Hi! Tell me what you need done — the type of work and any details you have — and I'll get your project posted for quotes. I'll use your saved address (${profile.label}) as the job location; just say so if this project is somewhere else.`
    : GREETING;
  const seededDraft = useMemo<ProjectDraft>(
    () =>
      profile ? { ...EMPTY_DRAFT, pincode: profile.zip, address: profile.label } : EMPTY_DRAFT,
    [profile],
  );

  // Real conversation turns only — the greeting bubble is prepended at render.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function send(text: string) {
    if (!text || isSending || done) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsSending(true);

    try {
      const turn = await AiAssistantService.send({ threadId, message: text });
      setThreadId(turn.threadId);
      setDraft(turn.draft);
      setMessages((prev) => [...prev, { role: "assistant", text: turn.message }]);
      if (turn.done) {
        setDone(true);
        setProject(turn.project);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "The assistant hit an error. Please try again.");
      } else {
        setError("Couldn't reach the server. Is the backend running?");
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input.trim());
  }

  function startOver() {
    setMessages([]);
    setInput("");
    setThreadId(null);
    setDraft(null);
    setDone(false);
    setProject(null);
    setError(null);
  }

  const allMessages: ChatMessage[] = [{ role: "assistant", text: greeting }, ...messages];
  const showSuggestions = messages.length === 0 && !isSending;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-primary" />
          AI Project Assistant
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your project in your own words — I&apos;ll ask what I need and build it out as
          we go.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Chat */}
        <div className="animate-fade-up flex min-h-[32rem] flex-col rounded-2xl border border-border/70 bg-card shadow-sm">
          <div ref={listRef} className="flex-1 space-y-3.5 overflow-y-auto p-5">
            {allMessages.map((m, i) => (
              <div
                key={i}
                className={`animate-chat-in flex items-start gap-2.5 ${
                  m.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.role === "user" ? (
                    <UserIcon aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Bot aria-hidden="true" className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="animate-chat-in flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <Bot aria-hidden="true" className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-foreground" />
                  <span
                    className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-foreground"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-foreground"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="animate-chat-in flex flex-wrap gap-2 pt-1 pl-9">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="border-t border-border/70 px-5 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          {done ? (
            <div className="animate-chat-in space-y-2.5 border-t border-border/70 p-4">
              {project && (
                <Button
                  className="h-10 w-full rounded-lg"
                  render={<Link href={`${ROUTES.projects}/${project.id}`} />}
                >
                  View your project
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              )}
              <Button variant="outline" className="h-10 w-full rounded-lg" onClick={startOver}>
                Start a new request
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border/70 p-3"
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="e.g. My AC stopped cooling, need a repair this week…"
                className="h-10 flex-1"
                disabled={isSending}
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-lg transition-transform active:scale-95"
                disabled={isSending || !input.trim()}
              >
                <Send aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          )}
        </div>

        {/* Live draft */}
        <div className="animate-fade-up animation-delay-100 min-h-[32rem]">
          <ProjectDraftPanel draft={draft ?? seededDraft} />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Prefer a form?{" "}
        <Link href={ROUTES.projectNew} className="underline underline-offset-2">
          Post a project manually
        </Link>
        .
      </p>
    </div>
  );
}
