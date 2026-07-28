"use client";

import { cn } from "@/lib/utils";

type StatusVariant = "live" | "beta" | "paused" | "offline";

interface Indicator1Props {
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<
  StatusVariant,
  { dot: string; ring: string; text: string; pill: string }
> = {
  live: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
    pill: "border-emerald-500/20 bg-emerald-500/10",
  },
  beta: {
    dot: "bg-amber-500",
    ring: "bg-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
    pill: "border-amber-500/20 bg-amber-500/10",
  },
  paused: {
    dot: "bg-slate-400",
    ring: "bg-slate-400/30",
    text: "text-slate-600 dark:text-slate-300",
    pill: "border-slate-400/20 bg-slate-400/10",
  },
  offline: {
    dot: "bg-rose-500",
    ring: "bg-rose-500/30",
    text: "text-rose-700 dark:text-rose-400",
    pill: "border-rose-500/20 bg-rose-500/10",
  },
};

export const indicator1Demo: Indicator1Props = {
  label: "Live",
  variant: "live",
};

export function Indicator1({
  label = "Live",
  variant = "live",
  className,
}: Indicator1Props) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur-sm",
          styles.pill
        )}
      >
        <span className="relative flex size-2 items-center justify-center">
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              styles.ring
            )}
            aria-hidden="true"
          />
          <span
            className={cn("relative size-2 rounded-full", styles.dot)}
            aria-hidden="true"
          />
        </span>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            styles.text
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
