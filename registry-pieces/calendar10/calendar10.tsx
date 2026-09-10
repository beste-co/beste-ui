"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface AgendaItem {
  time: string;
  title: string;
  location?: string;
  accent: "sky" | "emerald" | "rose" | "amber" | "violet";
}

interface Calendar10Props {
  heading?: string;
  items?: AgendaItem[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const accentClasses: Record<AgendaItem["accent"], string> = {
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
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

export const calendar10Demo: Calendar10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  heading: "Today · Thu 23 Apr",
  items: [
    {
      time: "09:30",
      title: "Design review",
      location: "Figma",
      accent: "sky",
    },
    {
      time: "11:00",
      title: "1:1 with Mira",
      location: "Meet",
      accent: "emerald",
    },
    {
      time: "14:30",
      title: "Ship room",
      location: "Office · 4F",
      accent: "violet",
    },
  ],
};

export function Calendar10({
  heading,
  items = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {heading}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-1.5",
                accentClasses[item.accent]
              )}
            >
              <span className="font-mono text-sm font-semibold">
                {item.time}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">
                  {item.title}
                </span>
                {item.location && (
                  <span className="truncate text-xs text-current/60">
                    {item.location}
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
