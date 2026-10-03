"use client";

import { cn } from "@/lib/utils";

interface Education24Props {
  title?: string;
  date?: string;
  time?: string;
  duration?: string;
  enrolled?: string;
  ctaLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const education24Demo: Education24Props = {
  title: "TypeScript generics",
  date: "Thu, May 2",
  time: "18:00",
  enrolled: "412 enrolled",
  ctaLabel: "Save my seat",
  bordered: false,
};

export function Education24({
  title,
  date,
  time,
  duration,
  enrolled,
  ctaLabel = "Join",
  bordered = false,
  className,
}: Education24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
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
        <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums text-muted-foreground">
          {date && <span>{date}</span>}
          {time && <span>{time}</span>}
          {duration && <span>{duration}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          {enrolled && (
            <span className="text-xs tabular-nums text-muted-foreground">{enrolled}</span>
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
