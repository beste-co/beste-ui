"use client";

import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary" | "destructive";

interface Calendar1Props {
  month?: string;
  day?: string;
  weekday?: string;
  tone?: Tone;
  className?: string;
}

const toneStripClasses: Record<Tone, string> = {
  foreground: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-white",
};

export const calendar1Demo: Calendar1Props = {
  month: "APR",
  day: "21",
  weekday: "Tuesday",
  tone: "destructive",
};

export function Calendar1({
  month,
  day,
  weekday,
  tone = "destructive",
  className,
}: Calendar1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-24 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div
          className={cn(
            "flex h-5 items-center justify-center text-xs font-bold uppercase tracking-wider",
            toneStripClasses[tone]
          )}
        >
          {month}
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2 py-2">
          <span className="text-3xl font-bold leading-none tabular-nums text-card-foreground">
            {day}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {weekday}
          </span>
        </div>
      </div>
    </div>
  );
}
