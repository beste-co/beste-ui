"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai38Props {
  steps?: string[];
  tone?: Tone;
  className?: string;
}

const nodeClasses: Record<Tone, string> = {
  primary: "border-primary/40 bg-primary/10 text-primary",
  foreground: "border-foreground/30 bg-foreground/5 text-foreground",
  violet:
    "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  emerald:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber:
    "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export const ai38Demo: Ai38Props = {
  steps: ["Query", "Retrieve", "Rerank", "Answer"],
  tone: "violet",
};

export function Ai38({ steps = [], tone = "violet", className }: Ai38Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <span
              className={cn(
                "rounded-sm border px-2 py-1 font-mono text-xs",
                nodeClasses[tone]
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
