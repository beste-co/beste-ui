"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface StatItem {
  value: string;
  label: string;
}

interface Stats3Props {
  items?: StatItem[];
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

export const stats3Demo: Stats3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  items: [
    { value: "128K", label: "Users" },
    { value: "4.2M", label: "Events" },
    { value: "99.98%", label: "Uptime" },
  ],
};

export function Stats3({ items = [], surface = "card", bordered = true, inverted = false, className }: Stats3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 px-3 py-3",
              i > 0 && "border-l border-current/15"
            )}
          >
            <span className="text-xl font-bold tabular-nums">
              {item.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-current/60">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
