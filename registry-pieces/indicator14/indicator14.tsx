"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "up" | "partial" | "down";

interface Indicator14Props {
  title?: string;
  uptime?: string;
  range?: string;
  bars?: Tone[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const barStyles: Record<Tone, string> = {
  up: "bg-emerald-500",
  partial: "bg-amber-500",
  down: "bg-rose-500",
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

export const indicator14Demo: Indicator14Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Booking service",
  uptime: "99.98%",
  range: "Last 45 days",
  bars: [
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "partial",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "down",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "partial",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ],
};

export function Indicator14({ title, uptime, range, bars = [], surface = "card", bordered = true, inverted = false, className }: Indicator14Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-80 rounded-md p-5 shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <p className="truncate text-sm font-semibold">{title}</p>
          )}
          {uptime && (
            <span className="shrink-0 text-sm font-medium tabular-nums text-emerald-500">
              {uptime}
            </span>
          )}
        </div>

        {bars.length > 0 && (
          <div className="mt-3 flex h-8 items-stretch gap-px" aria-hidden="true">
            {bars.map((bar, index) => (
              <span key={index} className={cn("flex-1 rounded-sm", barStyles[bar])} />
            ))}
          </div>
        )}

        {range && <p className="mt-2 text-sm text-current/60">{range}</p>}
      </div>
    </div>
  );
}
