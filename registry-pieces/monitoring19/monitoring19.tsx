"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring19Props {
  min?: string;
  max?: string;
  position?: number;
  bandStart?: number;
  bandEnd?: number;
  tone?: Tone;
  className?: string;
}

const markerClasses: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const bandClasses: Record<Tone, string> = {
  neutral: "bg-muted-foreground/20",
  primary: "bg-primary/20",
  foreground: "bg-foreground/20",
  emerald: "bg-emerald-500/20",
  sky: "bg-sky-500/20",
  violet: "bg-violet-500/20",
  amber: "bg-amber-500/20",
  rose: "bg-rose-500/20",
};

export const monitoring19Demo: Monitoring19Props = {
  min: "100ms",
  max: "500ms",
  position: 38,
  bandStart: 18,
  bandEnd: 52,
  tone: "violet",
};

export function Monitoring19({
  min = "0",
  max = "100",
  position = 0,
  bandStart = 0,
  bandEnd = 100,
  tone = "violet",
  className,
}: Monitoring19Props) {
  const pos = Math.min(100, Math.max(0, position));
  const bs = Math.min(100, Math.max(0, bandStart));
  const be = Math.min(100, Math.max(bs, bandEnd));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div
          className="relative h-1.5 w-full rounded-full bg-muted"
          aria-hidden="true"
        >
          <span
            className={cn(
              "absolute top-0 h-full rounded-full",
              bandClasses[tone]
            )}
            style={{ left: `${bs}%`, width: `${be - bs}%` }}
          />
          <span
            className={cn(
              "absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
              markerClasses[tone]
            )}
            style={{ left: `${pos}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
