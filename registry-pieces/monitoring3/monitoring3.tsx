"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "rose"
  | "amber"
  | "sky"
  | "emerald"
  | "violet";

interface Monitoring3Props {
  label?: string;
  title?: string;
  service?: string;
  time?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  rose: "text-rose-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
};

const tagClasses: Record<Tone, string> = {
  neutral: "border-border bg-muted text-foreground",
  primary: "border-primary/20 bg-primary/10 text-primary",
  foreground: "border-foreground/20 bg-foreground/10 text-foreground",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  amber:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  emerald:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  violet:
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

export const monitoring3Demo: Monitoring3Props = {
  label: "Critical",
  title: "5xx error rate above 2%",
  service: "checkout-api",
  time: "2m ago",
  tone: "rose",
};

export function Monitoring3({
  label = "Alert",
  title = "Incident triggered",
  service,
  time,
  tone = "rose",
  className,
}: Monitoring3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <Bell
          className={cn("mt-0.5 size-4 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                tagClasses[tone]
              )}
            >
              {label}
            </span>
            {time && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-snug text-card-foreground">
            {title}
          </p>
          {service && (
            <p className="font-mono text-xs text-muted-foreground">
              {service}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
