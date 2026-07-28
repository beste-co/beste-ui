"use client";

import { cn } from "@/lib/utils";

interface Form25Props {
  label?: string;
  value?: string;
  ticks?: string[];
  tickIndex?: number;
  className?: string;
}

export const form25Demo: Form25Props = {
  label: "Tone of voice",
  ticks: ["Formal", "Neutral", "Friendly", "Playful"],
  tickIndex: 2,
  value: "Friendly",
};

export function Form25({
  label,
  value,
  ticks = [],
  tickIndex = 0,
  className,
}: Form25Props) {
  const pct =
    ticks.length > 1 ? (tickIndex / (ticks.length - 1)) * 100 : 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-card-foreground">
              {label}
            </label>
          )}
          {value && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {value}
            </span>
          )}
        </div>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-sm"
            style={{ left: `calc(${pct}% - 0.5rem)` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {ticks.map((t, idx) => (
            <span
              key={idx}
              className={cn(
                idx === tickIndex && "font-semibold text-card-foreground"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
