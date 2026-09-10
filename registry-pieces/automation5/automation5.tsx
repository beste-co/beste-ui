"use client";

import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const automation5Demo: Automation5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2 rounded-md border border-dashed border-current/15 bg-current/5 px-2.5 py-1.5">
          <GitBranch
            className="size-3.5 text-current/60"
            aria-hidden="true"
          />
          <span className="text-xs text-current/60">{ifLabel}</span>
          <span className="flex-1 truncate font-mono text-xs">
            {condition}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1 rounded-md border border-current/15 p-2.5">
            <span className="inline-flex w-fit items-center rounded-sm bg-emerald-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {trueLabel}
            </span>
            <span className="text-xs font-medium">
              {truthy.label}
            </span>
            {truthy.steps && (
              <span className="text-xs text-current/60">
                {truthy.steps}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-md border border-current/15 p-2.5">
            <span className="inline-flex w-fit items-center rounded-sm bg-rose-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
              {falseLabel}
            </span>
            <span className="text-xs font-medium">
              {falsy.label}
            </span>
            {falsy.steps && (
              <span className="text-xs text-current/60">
                {falsy.steps}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
