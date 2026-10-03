"use client";

import { FileText } from "lucide-react";
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
  bordered?: boolean;
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
  tone: "primary",
  bordered: false,
};

export function Upload16({
  filename,
  percent = 0,
  remaining,
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2.5">
          <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
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
              "inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-semibold hover:opacity-90",
              buttonClasses[tone]
            )}
          >
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
