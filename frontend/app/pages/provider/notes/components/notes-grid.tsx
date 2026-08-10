"use client";

import { useState } from "react";
import { Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Note, NoteTag } from "../../data/notes";

const tagStyles: Record<NoteTag, string> = {
  client: "bg-chart-1/15 text-chart-1",
  crew: "bg-chart-2/15 text-chart-2",
  materials: "bg-chart-3/15 text-chart-3",
  ideas: "bg-chart-4/15 text-chart-4",
  admin: "bg-chart-5/15 text-chart-5",
};

type NotesGridProps = {
  notes: Note[];
  tags: { id: NoteTag; label: string }[];
};

export function NotesGrid({ notes, tags }: NotesGridProps) {
  const [activeTag, setActiveTag] = useState<NoteTag | "all">("all");

  const visibleNotes = notes
    .filter((note) => activeTag === "all" || note.tag === activeTag)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const labelFor = (tag: NoteTag) =>
    tags.find((t) => t.id === tag)?.label ?? tag;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant={activeTag === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setActiveTag("all")}
        >
          All
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.id}
            variant={activeTag === tag.id ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveTag(tag.id)}
          >
            {tag.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleNotes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="line-clamp-1">{note.title}</CardTitle>
              <CardAction>
                <Pin
                  className={
                    note.pinned
                      ? "size-4 fill-primary text-primary"
                      : "size-4 text-muted-foreground/40"
                  }
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 text-sm text-muted-foreground">
                {note.body}
              </p>
            </CardContent>
            <CardContent className="mt-auto flex items-center justify-between">
              <Badge variant="secondary" className={tagStyles[note.tag]}>
                {labelFor(note.tag)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {note.updated}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
