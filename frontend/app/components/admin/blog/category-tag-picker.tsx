"use client";

/** Shared multi-select-with-inline-create widget for post categories/tags. */

import { useState } from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface PickerProps {
  label: string;
  options: Option[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCreate: (name: string) => Promise<Option>;
  createPlaceholder: string;
}

export function CategoryTagPicker({
  label,
  options,
  selectedIds,
  onToggle,
  onCreate,
  createPlaceholder,
}: PickerProps) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    setError(null);
    try {
      const created = await onCreate(name);
      onToggle(created.id);
      setNewName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create that");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.length === 0 && (
          <p className="text-sm text-muted-foreground">None yet — add one below.</p>
        )}
        {options.map((option) => {
          const selected = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className="outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-full"
            >
              <Badge
                variant={selected ? "default" : "outline"}
                className={cn("cursor-pointer select-none", selected && "pr-2.5")}
              >
                {option.name}
              </Badge>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={createPlaceholder}
          className="h-8 max-w-52 text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleCreate();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={creating || !newName.trim()}
          onClick={handleCreate}
        >
          <Plus data-icon="inline-start" aria-hidden />
          Add
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
