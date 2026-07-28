"use client";

import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai30Props {
  category?: string;
  reason?: string;
  severity?: "low" | "medium" | "high";
  className?: string;
}

export const ai30Demo: Ai30Props = {
  category: "Harassment",
  reason: "Response blocked for containing targeted insults.",
  severity: "high",
};

const SEVERITY: Record<
  NonNullable<Ai30Props["severity"]>,
  { label: string; classes: string }
> = {
  low: {
    label: "low",
    classes: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  medium: {
    label: "medium",
    classes: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  high: {
    label: "high",
    classes: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
};

export function Ai30({
  category = "Category",
  reason,
  severity = "medium",
  className,
}: Ai30Props) {
  const s = SEVERITY[severity];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400"
          aria-hidden="true"
        >
          <ShieldAlert className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-card-foreground">
              {category}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium",
                s.classes
              )}
            >
              {s.label}
            </span>
          </div>
          {reason && (
            <p className="text-xs leading-snug text-muted-foreground">
              {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
