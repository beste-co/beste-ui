"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface BreakdownRow {
  label: string;
  percent: number;
}

interface Chart7Props {
  title?: string;
  caption?: string;
  items?: BreakdownRow[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const chart7Demo: Chart7Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Where the week went",
  caption: "Booked hours by appointment type",
  items: [
    { label: "Consultations", percent: 42 },
    { label: "Follow-ups", percent: 28 },
    { label: "Assessments", percent: 19 },
    { label: "Admin", percent: 11 },
  ],
};

export function Chart7({ title, caption, items = [], surface = "card", bordered = true, inverted = false, className }: Chart7Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {title && <p className="text-base font-semibold">{title}</p>}
        {caption && <p className="mt-0.5 text-sm text-current/60">{caption}</p>}

        <div className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm">{item.label}</span>
                <span className="shrink-0 text-sm tabular-nums text-current/60">
                  {item.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-current/10">
                <div
                  className={cn("h-full rounded-full", index === 0 ? "bg-primary" : "bg-primary/35")}
                  style={{ width: `${item.percent}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
