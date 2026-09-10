"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai5Props {
  used?: number;
  total?: number;
  label?: string;
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

export const ai5Demo: Ai5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  used: 4820,
  total: 8192,
  label: "Tokens",
};

export function Ai5({
  used = 0,
  total = 1,
  label = "Tokens",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai5Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, total)) * 100));
  const fill =
    pct >= 85
      ? "bg-rose-500"
      : pct >= 60
        ? "bg-amber-500"
        : "bg-emerald-500";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-1.5 rounded-md px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-current/60">
            {label}
          </span>
          <span className="font-mono text-xs tabular-nums">
            <span className="font-semibold">
              {used.toLocaleString()}
            </span>
            {" / "}
            {total.toLocaleString()}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className={cn("h-full rounded-full transition-all", fill)}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
