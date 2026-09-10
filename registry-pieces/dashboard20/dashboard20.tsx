"use client";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Info, OctagonX } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Severity = "critical" | "warning" | "info";

interface Dashboard20Props {
  counts?: Record<Severity, number>;
  criticalLabel?: string;
  warningLabel?: string;
  infoLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const SEVERITIES: Record<
  Severity,
  { icon: LucideIcon; classes: string }
> = {
  critical: {
    icon: OctagonX,
    classes: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    classes: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
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

export const dashboard20Demo: Dashboard20Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  counts: { critical: 2, warning: 6, info: 14 },
  criticalLabel: "Critical",
  warningLabel: "Warning",
  infoLabel: "Info",
};

export function Dashboard20({
  counts = { critical: 0, warning: 0, info: 0 },
  criticalLabel = "Critical",
  warningLabel = "Warning",
  infoLabel = "Info",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard20Props) {
  const order: Severity[] = ["critical", "warning", "info"];
  const labels: Record<Severity, string> = {
    critical: criticalLabel,
    warning: warningLabel,
    info: infoLabel,
  };

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-3 gap-2">
        {order.map((k) => {
          const cfg = SEVERITIES[k];
          const Icon = cfg.icon;
          const n = counts[k] ?? 0;
          return (
            <div
              key={k}
              className={cn("flex flex-col items-start gap-1 rounded-md p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-md",
                  cfg.classes
                )}
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {n}
              </span>
              <span className="text-xs text-current/60">{labels[k]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
