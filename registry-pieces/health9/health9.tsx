"use client";

import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface Macro {
  label: string;
  grams: number;
  class: string;
  text: string;
}

interface Health9Props {
  meal?: string;
  kcal?: number;
  macros?: Macro[];
  className?: string;
}

const defaultMacros: Macro[] = [
  { label: "Carbs", grams: 68, class: "bg-sky-500", text: "text-sky-500" },
  {
    label: "Protein",
    grams: 34,
    class: "bg-emerald-500",
    text: "text-emerald-500",
  },
  { label: "Fat", grams: 22, class: "bg-amber-500", text: "text-amber-500" },
];

export const health9Demo: Health9Props = {
  meal: "Lunch · Grilled chicken bowl",
  kcal: 620,
  macros: defaultMacros,
};

export function Health9({
  meal,
  kcal = 0,
  macros = defaultMacros,
  className,
}: Health9Props) {
  const totalGrams = macros.reduce((acc, m) => acc + m.grams, 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
            <Utensils className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {meal && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {meal}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {kcal} kcal · {totalGrams} g total
            </span>
          </div>
        </div>
        <div
          className="flex h-1.5 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          {macros.map((m, idx) => (
            <span
              key={idx}
              className={m.class}
              style={{ width: `${(m.grams / totalGrams) * 100}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {macros.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  m.text
                )}
              >
                {m.label}
              </span>
              <span className="font-mono text-sm font-semibold text-card-foreground">
                {m.grams} g
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
