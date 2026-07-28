"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "indigo"
  | "emerald"
  | "rose"
  | "amber";

interface Travel9Props {
  country?: string;
  city?: string;
  date?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const stampClasses: Record<Tone, string> = {
  primary: "border-primary text-primary",
  foreground: "border-foreground text-foreground",
  indigo: "border-indigo-600 text-indigo-700 dark:border-indigo-300 dark:text-indigo-200",
  emerald: "border-emerald-600 text-emerald-700 dark:border-emerald-300 dark:text-emerald-200",
  rose: "border-rose-600 text-rose-700 dark:border-rose-300 dark:text-rose-200",
  amber: "border-amber-600 text-amber-700 dark:border-amber-300 dark:text-amber-200",
};

export const travel9Demo: Travel9Props = {
  country: "Portugal",
  city: "Lisbon · LIS",
  date: "14 · 06 · 26",
  label: "Entered",
  tone: "primary",
};

export function Travel9({
  country,
  city,
  date,
  label,
  tone = "primary",
  className,
}: Travel9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex -rotate-6 flex-col items-center gap-1 rounded-full border-4 border-double bg-card/60 px-6 py-3 shadow-sm backdrop-blur-sm",
          stampClasses[tone]
        )}
      >
        {label && (
          <span className="text-xs font-semibold uppercase tracking-widest">
            {label}
          </span>
        )}
        {country && (
          <span className="text-base font-bold uppercase tracking-widest">
            {country}
          </span>
        )}
        {city && (
          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
            {city}
          </span>
        )}
        {date && (
          <span className="font-mono text-xs font-semibold">{date}</span>
        )}
      </div>
    </div>
  );
}
