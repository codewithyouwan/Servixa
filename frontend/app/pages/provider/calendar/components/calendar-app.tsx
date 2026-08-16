"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  calendarEvents,
  eventTypeMeta,
  type CalendarEvent,
  type EventType,
} from "../../data/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS = 2;

function toKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function timeToMinutes(time: string) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2]);
}

function buildMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}

function EventChip({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={cn(
        "truncate rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        eventTypeMeta[event.type].className
      )}
      title={`${event.time} — ${event.title}`}
    >
      {event.title}
    </div>
  );
}

function TypeBadge({ type }: { type: EventType }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        eventTypeMeta[type].className
      )}
    >
      {eventTypeMeta[type].label}
    </span>
  );
}

export function CalendarApp() {
  const [month, setMonth] = React.useState(() => new Date(2026, 7, 1));
  const today = new Date();
  const todayKey = toKey(today);

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of calendarEvents) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    }
    return map;
  }, []);

  const upcoming = React.useMemo(
    () =>
      calendarEvents
        .filter((event) => event.date >= todayKey)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            timeToMinutes(a.time) - timeToMinutes(b.time)
        )
        .slice(0, 6),
    [todayKey]
  );

  const days = buildMonthGrid(month);
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shiftMonth(delta: number) {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <Card className="min-w-0 flex-1">
        <CardHeader>
          <CardTitle>{monthLabel}</CardTitle>
          <CardAction className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
              }
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 border-b pb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((date) => {
              const key = toKey(date);
              const inMonth = date.getMonth() === month.getMonth();
              const isToday = key === todayKey;
              const dayEvents = eventsByDay.get(key) ?? [];
              const overflow = dayEvents.length - MAX_CHIPS;
              return (
                <div
                  key={key}
                  className={cn(
                    "flex min-h-24 flex-col gap-1 border-b border-l p-1.5 first:border-l-0 [&:nth-child(7n+1)]:border-l-0",
                    !inMonth && "bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center self-end rounded-full text-xs",
                      !inMonth && "text-muted-foreground/60",
                      isToday &&
                        "bg-primary font-semibold text-primary-foreground"
                    )}
                  >
                    {date.getDate()}
                  </span>
                  {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                    <EventChip key={event.id} event={event} />
                  ))}
                  {overflow > 0 && (
                    <span className="px-1 text-[11px] text-muted-foreground">
                      +{overflow} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-4 xl:w-[300px] xl:shrink-0">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcoming.map((event) => {
              const date = new Date(`${event.date}T00:00:00`);
              return (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex w-10 shrink-0 flex-col items-center rounded-lg border bg-muted/50 py-1">
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold">
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {event.time}
                      {event.client ? ` · ${event.client}` : ""}
                    </p>
                    <div className="mt-1">
                      <TypeBadge type={event.type} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(Object.keys(eventTypeMeta) as EventType[]).map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
