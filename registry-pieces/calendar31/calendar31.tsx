"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber" | "rose";

interface Slot {
  time: string;
  title: string;
  tone?: Tone;
}

interface Calendar31Props {
  title?: string;
  dateLabel?: string;
  items?: Slot[];
  className?: string;
}

const dotStyles: Record<Tone, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const calendar31Demo: Calendar31Props = {
  title: "Today",
  dateLabel: "Tue, 12 May",
  items: [
    { time: "09:00", title: "New member intake", tone: "primary" },
    { time: "11:30", title: "Care plan review", tone: "emerald" },
    { time: "14:00", title: "Billing sync", tone: "amber" },
    { time: "16:15", title: "Follow-up call", tone: "rose" },
  ],
};

export function Calendar31({
  title = "Schedule",
  dateLabel,
  items = [],
  className,
}: Calendar31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="text-base font-semibold text-card-foreground">{title}</p>
          {dateLabel && (
            <span className="text-sm text-muted-foreground">{dateLabel}</span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {items.map((slot, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-11 shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                {slot.time}
              </span>
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotStyles[slot.tone ?? "primary"]
                )}
                aria-hidden="true"
              />
              <span className="truncate text-sm text-card-foreground">
                {slot.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
