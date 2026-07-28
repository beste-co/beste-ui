"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai32Props {
  base?: string;
  dataset?: string;
  status?: "queued" | "running" | "succeeded";
  progress?: number;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

const STATUS_LABEL = {
  queued: "queued",
  running: "running",
  succeeded: "succeeded",
} as const;

export const ai32Demo: Ai32Props = {
  base: "llama-3-8b",
  dataset: "support_tickets",
  status: "running",
  progress: 62,
  tone: "violet",
};

export function Ai32({
  base = "base-model",
  dataset = "dataset",
  status = "running",
  progress = 0,
  tone = "violet",
  className,
}: Ai32Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1 font-mono text-xs">
            <span className="truncate text-card-foreground">{base}</span>
            <span className="text-muted-foreground">+</span>
            <span className="truncate text-muted-foreground">{dataset}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs">
            {status === "running" && (
              <Loader2
                className="size-3 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "font-medium",
                status === "succeeded"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              status === "succeeded" ? "bg-emerald-500" : barClasses[tone]
            )}
            style={{ width: `${status === "succeeded" ? 100 : pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
