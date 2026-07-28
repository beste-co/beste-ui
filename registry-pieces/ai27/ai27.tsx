"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai27Props {
  title?: string;
  snippet?: string;
  source?: string;
  score?: number;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
};

export const ai27Demo: Ai27Props = {
  title: "Implementing rate limits with Redis",
  snippet:
    "Use INCR with an EXPIRE TTL to build a fixed-window limiter that resets every minute.",
  source: "docs/guides/rate-limits.md",
  score: 0.92,
  tone: "violet",
};

export function Ai27({
  title = "Result",
  snippet,
  source,
  score,
  tone = "violet",
  className,
}: Ai27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <FileText
              className={cn("size-3.5 shrink-0", iconClasses[tone])}
              aria-hidden="true"
            />
            <span className="truncate text-xs font-semibold text-card-foreground">
              {title}
            </span>
          </div>
          {typeof score === "number" && (
            <span className="shrink-0 rounded-sm bg-emerald-500/15 px-1.5 py-0.5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {score.toFixed(2)}
            </span>
          )}
        </div>
        {snippet && (
          <p className="text-xs leading-snug text-muted-foreground">{snippet}</p>
        )}
        {source && (
          <span className="truncate font-mono text-xs text-muted-foreground">
            {source}
          </span>
        )}
      </div>
    </div>
  );
}
