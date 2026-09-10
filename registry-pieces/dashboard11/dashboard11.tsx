"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard11Entry {
  name: string;
  score: string;
}

interface Dashboard11Props {
  title?: string;
  entries?: Dashboard11Entry[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const MEDALS = [
  "bg-amber-500 text-amber-950",
  "bg-slate-300 text-slate-900",
  "bg-orange-700 text-orange-50",
];


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

export const dashboard11Demo: Dashboard11Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Top performers",
  entries: [
    { name: "Ada L.", score: "12,840" },
    { name: "Marcus R.", score: "10,320" },
    { name: "Priya S.", score: "8,960" },
  ],
};

export function Dashboard11({
  title = "Leaderboard",
  entries = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard11Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {title}
        </span>
        <div className="flex flex-col gap-1.5">
          {entries.slice(0, 3).map((e, i) => (
            <div key={e.name} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                  MEDALS[i]
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate text-xs font-medium">
                {e.name}
              </span>
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                {e.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
