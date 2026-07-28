"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "amber" | "sky" | "emerald";

interface Indicator6Props {
  level?: number;
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
};

export const indicator6Demo: Indicator6Props = {
  level: 68,
  label: "Room temp",
  tone: "sky",
};

export function Indicator6({
  level = 0,
  label,
  tone = "sky",
  className,
}: Indicator6Props) {
  const pct = Math.max(0, Math.min(100, level));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="relative flex h-20 w-3 flex-col justify-end">
          <div className="absolute inset-0 rounded-full border-2 border-muted bg-muted" />
          <div
            className={cn(
              "relative rounded-full transition-all",
              toneClasses[tone]
            )}
            style={{ height: `${pct}%` }}
            aria-hidden="true"
          />
          <span
            className={cn(
              "absolute -bottom-1.5 left-1/2 size-5 -translate-x-1/2 rounded-full border-2 border-card",
              toneClasses[tone]
            )}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
            {pct}°
          </span>
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
