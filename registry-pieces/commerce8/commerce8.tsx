"use client";

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
  bordered?: boolean;
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
  tone: "primary",
  bordered: false,
};

export function Commerce8({
  subtotal = 0,
  threshold = 100,
  currency = "$",
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="text-xs">
          {qualifies ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              You qualify for free shipping.
            </span>
          ) : (
            <span className="text-card-foreground">
              Add{" "}
              <span className="font-semibold tabular-nums">
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
      </div>
    </div>
  );
}
