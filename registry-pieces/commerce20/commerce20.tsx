"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce20Props {
  frequency?: string;
  next?: string;
  savePerOrder?: string;
  savePercent?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const ctaClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  rose: "bg-rose-500 text-white hover:bg-rose-600",
};

const badgeClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export const commerce20Demo: Commerce20Props = {
  frequency: "Every month",
  next: "May 21, 2026",
  savePercent: 10,
  tone: "primary",
  bordered: false,
};

export function Commerce20({
  frequency = "Every month",
  next,
  savePerOrder,
  savePercent,
  tone = "primary",
  bordered = false,
  className,
}: Commerce20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2.5 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-card-foreground">
            Subscribe & save
          </span>
          {typeof savePercent === "number" && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                badgeClasses[tone]
              )}
            >
              −{savePercent}%
            </span>
          )}
        </div>
        <button
          type="button"
          className={cn("flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-xs hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
        >
          <span className="text-muted-foreground">Frequency</span>
          <span className="flex items-center gap-1 text-card-foreground">
            <span className="font-medium">{frequency}</span>
            <ChevronDown
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </button>
        {(next || savePerOrder) && (
          <div className="flex flex-col gap-0.5 text-xs">
            {next && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next delivery</span>
                <span className="text-card-foreground">{next}</span>
              </div>
            )}
            {savePerOrder && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">You save</span>
                <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  {savePerOrder} / order
                </span>
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className={cn(
            "rounded-sm py-1.5 text-xs font-semibold transition-colors",
            ctaClasses[tone]
          )}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
