"use client";

import { Pill } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health28Props {
  medication?: string;
  dose?: string;
  schedule?: string;
  pharmacy?: string;
  refill?: string;
  remaining?: number;
  total?: number;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const health28Demo: Health28Props = {
  medication: "Lisinopril",
  dose: "10 mg · 1 tab daily",
  schedule: "Morning with food",
  pharmacy: "Green Cross Pharmacy",
  refill: "Refill on May 12",
  remaining: 8,
  total: 30,
  tone: "violet",
};

export function Health28({
  medication,
  dose,
  schedule,
  pharmacy,
  refill,
  remaining = 0,
  total = 1,
  tone = "violet",
  className,
}: Health28Props) {
  const pct = Math.round((remaining / Math.max(1, total)) * 100);
  const low = pct <= 20;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Pill className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {medication && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {medication}
              </span>
            )}
            {dose && (
              <span className="truncate text-xs text-muted-foreground">
                {dose}
              </span>
            )}
          </div>
        </div>
        {schedule && (
          <span className="text-xs italic text-muted-foreground">
            {schedule}
          </span>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {remaining} of {total} left
          </span>
          <span className="font-semibold text-amber-700 dark:text-amber-300">
            {refill}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn(
              "h-full rounded-full",
              low ? "bg-rose-500" : barClasses[tone]
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pharmacy && (
          <span className="text-xs text-muted-foreground">
            Ships from {pharmacy}
          </span>
        )}
      </div>
    </div>
  );
}
