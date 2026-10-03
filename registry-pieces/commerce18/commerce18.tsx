"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce18Props {
  amounts?: number[];
  selected?: number;
  currency?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const selectedClasses: Record<Tone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  foreground: "border-foreground bg-foreground text-background",
  violet: "border-violet-500 bg-violet-500 text-white",
  emerald: "border-emerald-500 bg-emerald-500 text-white",
  sky: "border-sky-500 bg-sky-500 text-white",
  amber: "border-amber-500 bg-amber-500 text-white",
  rose: "border-rose-500 bg-rose-500 text-white",
};

export const commerce18Demo: Commerce18Props = {
  amounts: [25, 50, 100, 250],
  selected: 100,
  currency: "$",
  tone: "primary",
  bordered: false,
};

export function Commerce18({
  amounts = [],
  selected,
  currency = "$",
  tone = "primary",
  bordered = false,
  className,
}: Commerce18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <span className="text-xs font-semibold text-muted-foreground">
          Gift card amount
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {amounts.map((a) => {
            const isSelected = a === selected;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  "rounded-sm border px-2 py-2 text-sm font-semibold tabular-nums transition-colors",
                  isSelected
                    ? selectedClasses[tone]
                    : "border-border bg-card text-card-foreground hover:bg-muted"
                )}
              >
                {currency}
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
