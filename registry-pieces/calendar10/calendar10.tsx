"use client";

import { cn } from "@/lib/utils";

interface AgendaItem {
  time: string;
  title: string;
  location?: string;
  accent: "sky" | "emerald" | "rose" | "amber" | "violet";
}

interface Calendar10Props {
  heading?: string;
  items?: AgendaItem[];
  className?: string;
}

const accentClasses: Record<AgendaItem["accent"], string> = {
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};

export const calendar10Demo: Calendar10Props = {
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
  className,
}: Calendar10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {item.title}
                </span>
                {item.location && (
                  <span className="truncate text-xs text-muted-foreground">
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
