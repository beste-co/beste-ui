"use client";

import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type RunStatus = "success" | "running" | "failed";

interface Automation4Run {
  id: string;
  status: RunStatus;
  duration: string;
  time: string;
}

interface Automation4Props {
  workflow?: string;
  headerLabel?: string;
  runs?: Automation4Run[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const STATUS: Record<
  RunStatus,
  { label: string; classes: string; bar: string }
> = {
  success: {
    label: "Success",
    classes: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  running: {
    label: "Running",
    classes: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
  },
  failed: {
    label: "Failed",
    classes: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
  },
};


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

export const automation4Demo: Automation4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  workflow: "Stripe → Slack",
  headerLabel: "Recent runs",
  runs: [
    { id: "run_8a2k", status: "success", duration: "412 ms", time: "2m ago" },
    { id: "run_7f9p", status: "running", duration: "—", time: "now" },
    { id: "run_7e1q", status: "failed", duration: "1.2 s", time: "8m ago" },
    { id: "run_7d3m", status: "success", duration: "388 ms", time: "14m ago" },
  ],
};

export function Automation4({
  workflow = "Workflow",
  headerLabel = "Recent runs",
  runs = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {headerLabel}
          </span>
          <span className="truncate text-xs">
            {workflow}
          </span>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {runs.map((r) => {
            const cfg = STATUS[r.status];
            return (
              <li
                key={r.id}
                className="flex items-center gap-2 py-1.5"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    cfg.classes
                  )}
                  aria-hidden="true"
                >
                  {r.status === "success" && (
                    <Check className="size-3" strokeWidth={3} />
                  )}
                  {r.status === "running" && (
                    <Loader2 className="size-3 animate-spin" />
                  )}
                  {r.status === "failed" && (
                    <X className="size-3" strokeWidth={3} />
                  )}
                </span>
                <span className="flex-1 truncate font-mono text-xs">
                  {r.id}
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-current/60">
                  {r.duration}
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-current/60">
                  {r.time}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
