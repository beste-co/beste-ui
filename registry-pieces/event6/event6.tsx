"use client";

import { cn } from "@/lib/utils";

type SessionTone = "opening" | "talk" | "break" | "workshop";

interface Session {
  time: string;
  title: string;
  track?: string;
  tone: SessionTone;
}

interface Event6Props {
  day?: string;
  sessions?: Session[];
  className?: string;
}

const dotClasses: Record<SessionTone, string> = {
  opening: "bg-amber-500",
  talk: "bg-sky-500",
  break: "bg-emerald-500",
  workshop: "bg-violet-500",
};

export const event6Demo: Event6Props = {
  day: "Day 1 · Fri, May 8",
  sessions: [
    {
      time: "09:00",
      title: "Opening keynote",
      track: "Main stage",
      tone: "opening",
    },
    {
      time: "10:00",
      title: "Designing with intent",
      track: "Track A",
      tone: "talk",
    },
    {
      time: "11:00",
      title: "Coffee & networking",
      tone: "break",
    },
    {
      time: "11:30",
      title: "Component systems workshop",
      track: "Workshop room",
      tone: "workshop",
    },
  ],
};

export function Event6({
  day,
  sessions = [],
  className,
}: Event6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {day && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {day}
          </span>
        )}
        <div className="flex flex-col">
          {sessions.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5"
            >
              <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {s.time}
              </span>
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotClasses[s.tone]
                )}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {s.title}
                </span>
                {s.track && (
                  <span className="truncate text-xs text-muted-foreground">
                    {s.track}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
