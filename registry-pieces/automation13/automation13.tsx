"use client";

import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Automation13Props {
  duration?: string;
  note?: string;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export const automation13Demo: Automation13Props = {
  duration: "Wait 15 minutes",
  note: "Then continue to the next step",
  tone: "amber",
};

export function Automation13({
  duration = "Wait",
  note,
  tone = "amber",
  className,
}: Automation13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2.5 rounded-md border border-dashed border-border bg-card p-3 shadow-sm">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            tileClasses[tone]
          )}
          aria-hidden="true"
        >
          <Timer className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold text-card-foreground">
            {duration}
          </span>
          {note && (
            <span className="truncate text-xs text-muted-foreground">
              {note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
