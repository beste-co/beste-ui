"use client";

import { FileText, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber";

interface Upload12Props {
  filename?: string;
  bytesUploaded?: string;
  bytesTotal?: string;
  speed?: string;
  eta?: string;
  percent?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-gradient-to-r from-primary/80 to-primary",
  foreground: "bg-gradient-to-r from-foreground/80 to-foreground",
  sky: "bg-gradient-to-r from-sky-400 to-sky-500",
  emerald: "bg-gradient-to-r from-emerald-400 to-emerald-500",
  violet: "bg-gradient-to-r from-violet-400 to-violet-500",
  amber: "bg-gradient-to-r from-amber-400 to-amber-500",
};

export const upload12Demo: Upload12Props = {
  filename: "campaign-edit-01.mov",
  bytesUploaded: "184 MB",
  bytesTotal: "312 MB",
  percent: 59,
  tone: "primary",
  bordered: false,
};

export function Upload12({
  filename,
  bytesUploaded,
  bytesTotal,
  speed,
  eta,
  percent = 0,
  tone = "primary",
  bordered = false,
  className,
}: Upload12Props) {
  const pct = Math.max(0, Math.min(100, percent));
  const sizeLine = [
    bytesUploaded && bytesTotal
      ? `${bytesUploaded} of ${bytesTotal}`
      : bytesUploaded || bytesTotal,
    speed,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2.5">
          <FileText
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            {sizeLine && (
              <span className="truncate text-xs text-muted-foreground tabular-nums">
                {sizeLine}
              </span>
            )}
          </div>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Pause"
          >
            <Pause className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Cancel"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full transition-all", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        {eta && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {eta}
          </span>
        )}
      </div>
    </div>
  );
}
