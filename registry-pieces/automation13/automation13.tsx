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

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
};

export const automation13Demo: Automation13Props = {
  duration: "Wait 15 minutes",
  note: "Then continue to the next step",
  tone: "primary",
};

export function Automation13({
  duration = "Wait",
  note,
  tone = "primary",
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
        <Timer className={cn("size-5 shrink-0", iconClasses[tone])} aria-hidden="true" />
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
