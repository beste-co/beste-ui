"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type CheckStatus = "ok" | "slow" | "fail";

interface Monitoring4Props {
  endpoint?: string;
  history?: CheckStatus[];
  uptime?: string;
  pastLabel?: string;
  nowLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const monitoring4Demo: Monitoring4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Monitoring4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-2 rounded-lg px-3 py-2.5 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-mono text-xs">
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
        <div className="flex items-center justify-between text-xs text-current/60">
          <span>{pastLabel}</span>
          <span>{nowLabel}</span>
        </div>
      </div>
    </div>
  );
}
