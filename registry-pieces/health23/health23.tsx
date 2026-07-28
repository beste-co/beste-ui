"use client";

import { ShieldCheck } from "lucide-react";
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

interface Vaccine {
  name: string;
  date: string;
  lot?: string;
}

interface Health23Props {
  title?: string;
  vaccines?: Vaccine[];
  status?: string;
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

const statusPillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export const health23Demo: Health23Props = {
  title: "Vaccination record",
  vaccines: [
    { name: "Tetanus (Tdap)", date: "2024-04-12", lot: "Lot K91A" },
    { name: "Influenza", date: "2025-10-03" },
    { name: "COVID-19 booster", date: "2026-01-18" },
  ],
  status: "Up to date · No boosters due",
  tone: "emerald",
};

export function Health23({
  title,
  vaccines = [],
  status,
  tone = "emerald",
  className,
}: Health23Props) {
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
              "flex size-7 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
          </div>
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {vaccines.map((v, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5 text-sm"
            >
              <span className="flex-1 truncate font-medium text-card-foreground">
                {v.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {v.date}
              </span>
              {v.lot && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {v.lot}
                </span>
              )}
            </div>
          ))}
        </div>
        {status && (
          <span
            className={cn(
              "rounded-md px-2 py-1 text-xs font-semibold",
              statusPillClasses[tone]
            )}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
