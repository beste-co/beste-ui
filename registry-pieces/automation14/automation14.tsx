"use client";

import { Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Automation14Props {
  headingLabel?: string;
  source?: string;
  current?: number;
  total?: number;
  currentLabel?: string;
  sampleKey?: string;
  sampleValue?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-current/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
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

export const automation14Demo: Automation14Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  headingLabel: "For each item",
  source: "items[]",
  current: 3,
  total: 28,
  currentLabel: "current",
  sampleKey: "item.email",
  sampleValue: "ada@beste.co",
  tone: "violet",
};

export function Automation14({
  headingLabel = "For each item",
  source = "items[]",
  current = 0,
  total = 1,
  currentLabel = "current",
  sampleKey,
  sampleValue,
  tone = "violet",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation14Props) {
  const pct = Math.min(100, (current / Math.max(1, total)) * 100);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
            aria-hidden="true"
          >
            <Repeat2 className="size-3.5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold">
              {headingLabel}
            </span>
            <span className="truncate font-mono text-xs text-current/60">
              {source}
            </span>
          </div>
          <span className="shrink-0 font-mono text-xs tabular-nums text-current/60">
            {current} / {total}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        {sampleKey && sampleValue && (
          <div className="flex items-center gap-1.5 rounded-sm bg-current/5 px-2 py-1 font-mono text-xs">
            <span className="text-current/60">{currentLabel}</span>
            <span className="">·</span>
            <span className="truncate text-sky-600 dark:text-sky-400">
              {sampleValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
