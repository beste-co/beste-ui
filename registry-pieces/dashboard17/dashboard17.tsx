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

interface Dashboard17Props {
  label?: string;
  value?: string;
  rate?: string;
  tone?: Tone;
  className?: string;
}

const pingClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const textClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

export const dashboard17Demo: Dashboard17Props = {
  label: "Live requests",
  value: "2,418",
  rate: "+24 / sec",
  tone: "emerald",
};

export function Dashboard17({
  label = "Live",
  value = "0",
  rate,
  tone = "emerald",
  className,
}: Dashboard17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2" aria-hidden="true">
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-60",
                pingClasses[tone]
              )}
            />
            <span
              className={cn("relative size-2 rounded-full", pingClasses[tone])}
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <span className="font-mono text-2xl font-semibold tabular-nums text-card-foreground">
          {value}
        </span>
        {rate && (
          <span
            className={cn(
              "font-mono text-xs font-medium tabular-nums",
              textClasses[tone]
            )}
          >
            {rate}
          </span>
        )}
      </div>
    </div>
  );
}
