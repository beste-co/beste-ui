"use client";

import { FileText, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "amber"
  | "sky"
  | "emerald"
  | "violet";

interface Upload16Props {
  filename?: string;
  percent?: number;
  remaining?: string;
  tone?: Tone;
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  amber: "bg-amber-500 text-white",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
};

const textClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  amber: "text-amber-700 dark:text-amber-300",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
};

export const upload16Demo: Upload16Props = {
  filename: "keynote-rehearsal.mp4",
  percent: 34,
  remaining: "Paused · 212 MB left",
  tone: "amber",
};

export function Upload16({
  filename,
  percent = 0,
  remaining,
  tone = "amber",
  className,
}: Upload16Props) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            {remaining && (
              <span className={cn("truncate text-xs", textClasses[tone])}>
                {remaining}
              </span>
            )}
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold hover:opacity-90",
              buttonClasses[tone]
            )}
            aria-label="Resume"
          >
            <Play className="size-3" aria-hidden="true" />
            Resume
          </button>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
