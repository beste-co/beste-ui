"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai34Row {
  label: string;
  tokens: number;
  cost: number;
}

interface Ai34Props {
  rows?: Ai34Row[];
  currency?: string;
  tone?: Tone;
  className?: string;
}

const totalClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
};

export const ai34Demo: Ai34Props = {
  rows: [
    { label: "Input", tokens: 1240, cost: 0.0031 },
    { label: "Output", tokens: 528, cost: 0.0053 },
  ],
  currency: "$",
  tone: "violet",
};

export function Ai34({
  rows = [],
  currency = "$",
  tone = "violet",
  className,
}: Ai34Props) {
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalTokens = rows.reduce((s, r) => s + r.tokens, 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col gap-1 font-mono text-xs">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-muted-foreground">{r.label}</span>
              <div className="flex items-center gap-3">
                <span className="tabular-nums text-card-foreground">
                  {r.tokens.toLocaleString()}
                </span>
                <span className="w-14 text-right tabular-nums text-card-foreground">
                  {currency}
                  {r.cost.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-mono text-xs">
          <span className="font-semibold text-card-foreground">Total</span>
          <div className="flex items-center gap-3">
            <span className="tabular-nums text-muted-foreground">
              {totalTokens.toLocaleString()} tok
            </span>
            <span
              className={cn(
                "w-14 text-right text-sm font-semibold tabular-nums",
                totalClasses[tone]
              )}
            >
              {currency}
              {totalCost.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
