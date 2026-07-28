"use client";

import { Calendar, Check, MapPin, Users } from "lucide-react";
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
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
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
  where: "Google Meet · meet.beste.co/kestrel",
  guests: "3 invited",
  label: "Meeting booked",
  tone: "neutral",
};

export function Calendar14({
  title,
  when,
  where,
  guests,
  label,
  tone = "neutral",
  className,
}: Calendar14Props) {
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
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Check className="size-4" aria-hidden="true" />
          </div>
          {label && (
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
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
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="text-card-foreground">{when}</span>
            </span>
          )}
          {where && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate font-mono text-card-foreground">
                {where}
              </span>
            </span>
          )}
          {guests && (
            <span className="inline-flex items-center gap-2">
              <Users className="size-3.5 shrink-0" aria-hidden="true" />
              {guests}
            </span>
          )}
        </div>
        <div className="flex gap-2 border-t border-border pt-2">
          <button
            type="button"
            className="flex-1 rounded-md bg-foreground px-2 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          >
            Add to calendar
          </button>
          <button
            type="button"
            className="rounded-md border border-border bg-card px-2 py-1.5 text-sm font-semibold text-card-foreground hover:bg-muted"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
