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
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/15 text-foreground",
  sky: "bg-sky-500/15 text-sky-500",
  emerald: "bg-emerald-500/15 text-emerald-500",
  violet: "bg-violet-500/15 text-violet-500",
  amber: "bg-amber-500/15 text-amber-500",
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
  speed: "12.4 MB/s",
  eta: "10s left",
  percent: 59,
  tone: "sky",
};

export function Upload12({
  filename,
  bytesUploaded,
  bytesTotal,
  speed,
  eta,
  percent = 0,
  tone = "sky",
  className,
}: Upload12Props) {
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
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
          >
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {bytesUploaded} of {bytesTotal} · {speed}
            </span>
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
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground">{pct}%</span>
          <span className="font-medium text-muted-foreground">{eta}</span>
        </div>
      </div>
    </div>
  );
}
