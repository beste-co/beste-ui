"use client";

import { cn } from "@/lib/utils";

type Tone = "up" | "partial" | "down";

interface Indicator14Props {
  title?: string;
  uptime?: string;
  range?: string;
  bars?: Tone[];
  className?: string;
}

const barStyles: Record<Tone, string> = {
  up: "bg-emerald-500",
  partial: "bg-amber-500",
  down: "bg-rose-500",
};

export const indicator14Demo: Indicator14Props = {
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

export function Indicator14({ title, uptime, range, bars = [], className }: Indicator14Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <p className="truncate text-sm font-semibold text-card-foreground">{title}</p>
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

        {range && <p className="mt-2 text-sm text-muted-foreground">{range}</p>}
      </div>
    </div>
  );
}
