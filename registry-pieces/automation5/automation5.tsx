"use client";

import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation5Branch {
  label: string;
  steps?: string;
}

interface Automation5Props {
  condition?: string;
  truthy?: Automation5Branch;
  falsy?: Automation5Branch;
  ifLabel?: string;
  trueLabel?: string;
  falseLabel?: string;
  className?: string;
}

export const automation5Demo: Automation5Props = {
  condition: "amount > $100",
  truthy: { label: "Notify finance", steps: "2 actions" },
  falsy: { label: "Skip", steps: "no actions" },
  ifLabel: "if",
  trueLabel: "true",
  falseLabel: "false",
};

export function Automation5({
  condition = "condition",
  truthy = { label: "Yes" },
  falsy = { label: "No" },
  ifLabel = "if",
  trueLabel = "true",
  falseLabel = "false",
  className,
}: Automation5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-2.5 py-1.5">
          <GitBranch
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs text-muted-foreground">{ifLabel}</span>
          <span className="flex-1 truncate font-mono text-xs text-card-foreground">
            {condition}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1 rounded-md border border-border p-2.5">
            <span className="inline-flex w-fit items-center rounded-sm bg-emerald-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {trueLabel}
            </span>
            <span className="text-xs font-medium text-card-foreground">
              {truthy.label}
            </span>
            {truthy.steps && (
              <span className="text-xs text-muted-foreground">
                {truthy.steps}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-md border border-border p-2.5">
            <span className="inline-flex w-fit items-center rounded-sm bg-rose-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
              {falseLabel}
            </span>
            <span className="text-xs font-medium text-card-foreground">
              {falsy.label}
            </span>
            {falsy.steps && (
              <span className="text-xs text-muted-foreground">
                {falsy.steps}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
