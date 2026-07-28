"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface Macro {
  label: string;
  grams: number;
  pct: number;
  color: string;
}

interface Food6Props {
  dish?: string;
  kcal?: string;
  macros?: Macro[];
  className?: string;
}

export const food6Demo: Food6Props = {
  dish: "Grilled chicken bowl",
  kcal: "620 kcal",
  macros: [
    { label: "Carbs", grams: 68, pct: 40, color: "bg-sky-500" },
    { label: "Protein", grams: 42, pct: 34, color: "bg-emerald-500" },
    { label: "Fat", grams: 22, pct: 26, color: "bg-amber-500" },
  ],
};

export function Food6({
  dish,
  kcal,
  macros = [],
  className,
}: Food6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <Scale className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {dish && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {dish}
              </span>
            )}
            {kcal && (
              <span className="text-xs text-muted-foreground">{kcal}</span>
            )}
          </div>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full" aria-hidden="true">
          {macros.map((m, idx) => (
            <span
              key={idx}
              className={m.color}
              style={{ width: `${m.pct}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {macros.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <span
                  className={cn("size-1.5 rounded-full", m.color)}
                  aria-hidden="true"
                />
                {m.label}
              </span>
              <span className="font-mono font-semibold text-card-foreground">
                {m.grams} g
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
