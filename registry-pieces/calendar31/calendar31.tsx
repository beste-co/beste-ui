"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const dotStyles: Record<Tone, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const calendar31Demo: Calendar31Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar31Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="mb-4 flex items-baseline justify-between">
          <p className="text-base font-semibold">{title}</p>
          {dateLabel && (
            <span className="text-sm text-current/60">{dateLabel}</span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {items.map((slot, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-11 shrink-0 font-mono text-sm tabular-nums text-current/60">
                {slot.time}
              </span>
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotStyles[slot.tone ?? "primary"]
                )}
                aria-hidden="true"
              />
              <span className="truncate text-sm">
                {slot.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
