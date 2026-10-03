"use client";

import { Zap } from "lucide-react";
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

interface Health25Props {
  metric?: string;
  value?: string;
  status?: string;
  history?: number[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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

const statusClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const health25Demo: Health25Props = {
  metric: "HRV · overnight",
  value: "68 ms",
  status: "Recovery looks strong",
  history: [54, 58, 62, 60, 66, 72, 68],
  tone: "primary",
  bordered: false,
};

export function Health25({
  metric,
  value,
  status,
  history = [],
  tone = "primary",
  bordered = false,
  className,
}: Health25Props) {
  const max = Math.max(...history, 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Zap
            className={cn("size-4 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          {metric && (
            <span className="text-xs font-semibold text-muted-foreground">
              {metric}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-card-foreground">
            {value}
          </span>
          {status && (
            <span className={cn("text-xs font-medium", statusClasses[tone])}>
              {status}
            </span>
          )}
        </div>
        <div className="flex h-10 items-end gap-1" aria-hidden="true">
          {history.map((h, idx) => (
            <div
              key={idx}
              className={cn(
                "flex-1 rounded-t-sm opacity-60",
                barClasses[tone],
                idx === history.length - 1 && "opacity-100"
              )}
              style={{ height: `${(h / max) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
