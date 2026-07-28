"use client";

import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education24Props {
  title?: string;
  date?: string;
  time?: string;
  duration?: string;
  enrolled?: string;
  ctaLabel?: string;
  className?: string;
}

export const education24Demo: Education24Props = {
  title: "Live workshop · TypeScript generics",
  date: "Thu, May 2",
  time: "18:00 UTC+3",
  duration: "90 minutes",
  enrolled: "412 enrolled · 88 seats left",
  ctaLabel: "Save my seat",
};

export function Education24({
  title,
  date,
  time,
  duration,
  enrolled,
  ctaLabel = "Join",
  className,
}: Education24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
          <span
            className="size-1.5 animate-pulse rounded-full bg-white"
            aria-hidden="true"
          />
          Live workshop
        </span>
        {title && (
          <span className="text-sm font-semibold leading-snug text-card-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              {date}
            </span>
          )}
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              {time}
            </span>
          )}
          {duration && <span>{duration}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          {enrolled && (
            <span className="text-xs text-muted-foreground">{enrolled}</span>
          )}
          <button
            type="button"
            className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
