"use client";

import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Commerce8Props {
  subtotal?: number;
  threshold?: number;
  currency?: string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const commerce8Demo: Commerce8Props = {
  subtotal: 48,
  threshold: 75,
  currency: "$",
  tone: "emerald",
};

export function Commerce8({
  subtotal = 0,
  threshold = 100,
  currency = "$",
  tone = "emerald",
  className,
}: Commerce8Props) {
  const pct = Math.max(0, Math.min(100, (subtotal / threshold) * 100));
  const remaining = Math.max(0, threshold - subtotal);
  const qualifies = subtotal >= threshold;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs">
          <Truck
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          {qualifies ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              You qualify for free shipping.
            </span>
          ) : (
            <span className="text-card-foreground">
              Add{" "}
              <span className="font-mono font-semibold tabular-nums">
                {currency}
                {remaining.toFixed(0)}
              </span>{" "}
              more for free shipping.
            </span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>
            {currency}
            {subtotal.toFixed(0)}
          </span>
          <span>
            {currency}
            {threshold.toFixed(0)} goal
          </span>
        </div>
      </div>
    </div>
  );
}
