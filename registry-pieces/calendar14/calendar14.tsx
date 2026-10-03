"use client";

import { Check } from "lucide-react";
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

interface Calendar14Props {
  title?: string;
  when?: string;
  where?: string;
  guests?: string;
  label?: string;
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

const labelClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const calendar14Demo: Calendar14Props = {
  title: "Discovery call with Kestrel Labs",
  when: "Thu, Apr 30 · 14:00 – 14:30",
  where: "Google Meet",
  label: "Meeting booked",
  tone: "neutral",
  bordered: false,
};

export function Calendar14({
  title,
  when,
  where,
  guests,
  label,
  tone = "neutral",
  bordered = false,
  className,
}: Calendar14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Check
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          {label && (
            <span
              className={cn(
                "text-xs font-semibold",
                labelClasses[tone]
              )}
            >
              {label}
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {when && (
            <span className="tabular-nums text-card-foreground">{when}</span>
          )}
          {where && <span className="truncate">{where}</span>}
          {guests && <span className="truncate">{guests}</span>}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="flex-1 rounded-md bg-foreground px-2 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          >
            Add to calendar
          </button>
          <button
            type="button"
            className={cn("rounded-md px-2 py-1.5 text-sm font-semibold text-card-foreground hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
