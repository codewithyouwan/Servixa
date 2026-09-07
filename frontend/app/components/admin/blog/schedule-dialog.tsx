"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ScheduleDialogProps {
  onSchedule: (scheduledAtIso: string) => Promise<void>;
  disabled?: boolean;
}

function defaultTime(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000); // an hour from now
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function ScheduleDialog({ onSchedule, disabled }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(defaultTime());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!date) return;
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0, 0);

    if (combined.getTime() <= Date.now()) {
      setError("Pick a time in the future.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSchedule(combined.toISOString());
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't schedule this post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" disabled={disabled} />}>
        <CalendarClock data-icon="inline-start" aria-hidden />
        Schedule
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Schedule this post</DialogTitle>
          <DialogDescription>
            It goes live automatically at the date and time you pick — no need to come back and
            publish it by hand.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
          />
          <div className="flex w-full items-center justify-between gap-3 px-1">
            <Label htmlFor="schedule-time">Time</Label>
            <input
              id="schedule-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={submitting || !date} onClick={handleConfirm}>
            {submitting ? "Scheduling…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
