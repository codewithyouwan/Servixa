"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Bot, Send, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { AiAssistantService } from "@/lib/homeowner/services/ai-assistant-service";
import type { Project } from "@/lib/homeowner/types";
import { ApiError } from "@/lib/types";

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

const GREETING =
  "Hi! Tell me what you need done — the type of work, roughly where, and any details you have — and I'll get your project posted for quotes.";

/**
 * AI Project Assistant — conversational project intake. Talks to
 * POST /ai/project-assistant (marketplace_agent LangGraph on the
 * backend); see that router for the request/response contract. This is
 * the AI-guided counterpart to the manual form at
 * /pages/dashboard/projects/new — either one ends with a real, posted
 * project.
 */
export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", text: GREETING }]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending || done) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsSending(true);
    scrollToBottom();

    try {
      const turn = await AiAssistantService.send({ threadId, message: text });
      setThreadId(turn.threadId);
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
      scrollToBottom();
    }
  }

  function startOver() {
    setMessages([{ role: "assistant", text: GREETING }]);
    setInput("");
    setThreadId(null);
    setDone(false);
    setProject(null);
    setError(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">AI Project Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your project in your own words — I&apos;ll ask what I need to know and post it
          for you.
        </p>
      </div>

      <div className="flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm">
        <div ref={listRef} className="flex max-h-[28rem] min-h-[20rem] flex-col gap-3 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.role === "user" ? (
                  <UserIcon aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Bot aria-hidden="true" className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Bot aria-hidden="true" className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-muted px-3.5 py-2 text-sm text-muted-foreground">
                Thinking…
              </div>
            </div>
          )}
        </div>

        {done ? (
          <div className="space-y-3 border-t border-border/70 p-5">
            {project ? (
              <Button
                className="h-10 w-full rounded-lg"
                render={<Link href={`${ROUTES.projects}/${project.id}`} />}
              >
                View your project
              </Button>
            ) : null}
            <Button variant="outline" className="h-10 w-full rounded-lg" onClick={startOver}>
              Start a new request
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border/70 p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. My AC stopped cooling, need a repair this week…"
              className="h-10 flex-1"
              disabled={isSending}
              autoFocus
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-lg" disabled={isSending || !input.trim()}>
              <Send aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        )}

        {error && (
          <p role="alert" className="border-t border-border/70 px-5 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
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
