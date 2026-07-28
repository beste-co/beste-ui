"use client";

import { cn } from "@/lib/utils";

type CheckStatus = "ok" | "slow" | "fail";

interface Monitoring4Props {
  endpoint?: string;
  history?: CheckStatus[];
  uptime?: string;
  pastLabel?: string;
  nowLabel?: string;
  className?: string;
}

const checkStyles: Record<CheckStatus, string> = {
  ok: "bg-emerald-500",
  slow: "bg-amber-500",
  fail: "bg-rose-500",
};

const defaultHistory: CheckStatus[] = [
  "ok", "ok", "ok", "ok", "ok", "ok", "ok", "slow", "ok", "ok",
  "ok", "ok", "ok", "ok", "ok", "ok", "fail", "ok", "ok", "ok",
  "ok", "ok", "slow", "ok", "ok", "ok", "ok", "ok", "ok", "ok",
];

export const monitoring4Demo: Monitoring4Props = {
  endpoint: "auth.beste.co",
  history: defaultHistory,
  uptime: "99.92%",
  pastLabel: "30d ago",
  nowLabel: "Today",
};

export function Monitoring4({
  endpoint = "endpoint",
  history = defaultHistory,
  uptime,
  pastLabel = "30d ago",
  nowLabel = "Today",
  className,
}: Monitoring4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-mono text-xs text-card-foreground">
            {endpoint}
          </span>
          {uptime && (
            <span className="text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {uptime}
            </span>
          )}
        </div>
        <div className="flex h-6 items-stretch gap-0.5" aria-hidden="true">
          {history.map((status, i) => (
            <span
              key={i}
              className={cn("flex-1 rounded-sm", checkStyles[status])}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{pastLabel}</span>
          <span>{nowLabel}</span>
        </div>
      </div>
    </div>
  );
}
