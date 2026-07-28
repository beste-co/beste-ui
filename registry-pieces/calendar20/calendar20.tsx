"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reminder {
  title: string;
  when: string;
  tone: "sky" | "emerald" | "rose" | "amber";
}

interface Calendar20Props {
  heading?: string;
  reminders?: Reminder[];
  className?: string;
}

const dotClasses: Record<Reminder["tone"], string> = {
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export const calendar20Demo: Calendar20Props = {
  heading: "Upcoming reminders",
  reminders: [
    {
      title: "Pay estimated tax",
      when: "Thu, Apr 24 · 17:00",
      tone: "rose",
    },
    {
      title: "Annual review prep",
      when: "Fri, Apr 25 · 09:00",
      tone: "sky",
    },
    {
      title: "Call parents",
      when: "Sat, Apr 26 · 11:00",
      tone: "emerald",
    },
    {
      title: "Yoga class",
      when: "Sun, Apr 27 · 08:00",
      tone: "amber",
    },
  ],
};

export function Calendar20({
  heading,
  reminders = [],
  className,
}: Calendar20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
            <Bell className="size-3.5" aria-hidden="true" />
          </div>
          {heading && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {reminders.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 py-1.5"
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotClasses[r.tone]
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-sm font-medium text-card-foreground">
                {r.title}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {r.when}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
