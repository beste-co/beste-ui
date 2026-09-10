"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Direction = "up" | "down" | "flat";

interface Kpi {
  label: string;
  value: string;
  delta?: string;
  direction?: Direction;
}

interface Dashboard33Props {
  title?: string;
  range?: string;
  items?: Kpi[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const deltaStyles: Record<Direction, string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  flat: "text-current/60",
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

export const dashboard33Demo: Dashboard33Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "This week",
  range: "Mon – Sun",
  items: [
    { label: "Booked", value: "142", delta: "+9", direction: "up" },
    { label: "No-shows", value: "3", delta: "-4", direction: "down" },
    { label: "Hours", value: "96", delta: "0", direction: "flat" },
  ],
};

export function Dashboard33({ title, range, items = [], surface = "card", bordered = true, inverted = false, className }: Dashboard33Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-3 border-b border-current/15 px-5 py-3">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {range && <span className="text-xs text-current/60">{range}</span>}
        </div>

        <div className="grid grid-cols-3 divide-x divide-border">
          {items.map((item, index) => (
            <div key={index} className="px-5 py-4">
              <p className="truncate text-sm text-current/60">{item.label}</p>
              <p className="mt-1 text-2xl font-light tracking-tight tabular-nums">
                {item.value}
              </p>
              {item.delta && (
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium tabular-nums",
                    deltaStyles[item.direction ?? "flat"]
                  )}
                >
                  {item.delta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
