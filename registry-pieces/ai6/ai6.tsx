"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai6Props {
  value?: number;
  label?: string;
  lowLabel?: string;
  highLabel?: string;
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

export const ai6Demo: Ai6Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  value: 0.7,
  label: "Temperature",
  lowLabel: "Focused",
  highLabel: "Creative",
};

export function Ai6({
  value = 0,
  label = "Temperature",
  lowLabel = "Focused",
  highLabel = "Creative",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai6Props) {
  const pct = Math.max(0, Math.min(100, value * 100));

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-2 rounded-md px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {value.toFixed(1)}
          </span>
        </div>
        <div
          className="relative flex h-5 items-center"
          aria-hidden="true"
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500" />
          <span
            className="absolute size-4 -translate-x-1/2 rounded-full border-2 border-foreground bg-background shadow-sm text-foreground"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-current/60">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}
