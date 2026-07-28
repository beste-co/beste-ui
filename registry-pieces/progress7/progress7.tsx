"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "sunset";

interface Progress7Props {
  value?: number;
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-gradient-to-t from-emerald-500 to-emerald-300",
  sky: "bg-gradient-to-t from-sky-500 to-cyan-300",
  sunset: "bg-gradient-to-t from-rose-500 to-amber-300",
};

export const progress7Demo: Progress7Props = {
  value: 72,
  label: "Hydration",
  tone: "sky",
};

export function Progress7({
  value = 0,
  label,
  tone = "primary",
  className,
}: Progress7Props) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <div className="relative flex h-20 w-6 items-end overflow-hidden rounded-md border border-border bg-muted">
          <div
            className={cn("w-full rounded-t-md transition-all", toneClasses[tone])}
            style={{ height: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
            {pct}%
          </span>
          {label && (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
