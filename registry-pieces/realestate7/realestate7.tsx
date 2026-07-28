"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate7Props {
  rating?: string;
  score?: string;
  annualSavings?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const badgeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const savingsClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const realestate7Demo: Realestate7Props = {
  rating: "A",
  score: "92 / 100",
  annualSavings: "~$1,820 annual utility savings",
  label: "Energy efficiency",
  tone: "emerald",
};

export function Realestate7({
  rating = "A",
  score,
  annualSavings,
  label,
  tone = "emerald",
  className,
}: Realestate7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl shadow-md",
            badgeClasses[tone]
          )}
        >
          <span className="font-serif text-2xl font-bold leading-none">
            {rating}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide">
            Rated
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
          <span className="font-mono text-lg font-bold text-card-foreground">
            {score}
          </span>
          {annualSavings && (
            <span className={cn("text-sm", savingsClasses[tone])}>
              {annualSavings}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
