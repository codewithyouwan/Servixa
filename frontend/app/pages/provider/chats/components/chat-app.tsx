"use client";

import * as React from "react";
import { ArrowLeft, Search, Send } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  conversations,
  messages as seedMessages,
  type Conversation,
  type Message,
} from "../../data/chats";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ConversationAvatar({
  conversation,
  size = "default",
}: {
  conversation: Conversation;
  size?: "default" | "lg";
}) {
  return (
    <Avatar size={size}>
      <AvatarFallback>{initials(conversation.name)}</AvatarFallback>
      {conversation.online && <AvatarBadge className="bg-chart-3" />}
    </Avatar>
  );
}

export function ChatApp() {
  const [selectedId, setSelectedId] = React.useState(conversations[0].id);
  const [localMessages, setLocalMessages] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState("");
  const [showThread, setShowThread] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const selected =
    conversations.find((c) => c.id === selectedId) ?? conversations[0];
  const thread = [...seedMessages, ...localMessages].filter(
    (m) => m.conversationId === selected.id
  );

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selected.id, localMessages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        conversationId: selected.id,
        from: "me",
        text,
        time: "Now",
      },
    ]);
    setDraft("");
  }

  return (
    <Card className="h-[calc(100dvh-5.5rem)] flex-row gap-0 overflow-hidden py-0 lg:h-[calc(100dvh-6.5rem)]">
      <div
        className={cn(
          "w-full flex-col md:flex md:w-80 md:shrink-0 md:border-r",
          showThread ? "hidden" : "flex"
        )}
      >
        <div className="border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations…" className="pl-8" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                setSelectedId(conversation.id);
                setShowThread(true);
              }}
              className={cn(
                "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
                conversation.id === selected.id && "bg-muted"
              )}
            >
              <ConversationAvatar conversation={conversation} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {conversation.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {conversation.time}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {conversation.project}
                </p>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <Badge className="size-5 shrink-0 rounded-full p-0">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 flex-col md:flex",
          showThread ? "flex" : "hidden"
        )}
      >
        <div className="flex items-center gap-3 border-b p-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setShowThread(false)}
            aria-label="Back to conversations"
          >
            <ArrowLeft />
          </Button>
          <ConversationAvatar conversation={selected} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selected.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {selected.project} ·{" "}
              {selected.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            {thread.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[75%] flex-col gap-1",
                  message.from === "me" ? "items-end self-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm",
                    message.from === "me"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted"
                  )}
                >
                  {message.text}
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${selected.name}…`}
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <Send />
          </Button>
        </form>
      </div>
    </Card>
  );
}
