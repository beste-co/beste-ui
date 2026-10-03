"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai42Props {
  tokens?: string[];
  tokensPerSecond?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const chipClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export const ai42Demo: Ai42Props = {
  tokens: ["The", " quick", " brown", " fox"],
  tokensPerSecond: 142,
  tone: "primary",
  bordered: false,
};

export function Ai42({
  tokens = [],
  tokensPerSecond,
  tone = "primary",
  bordered = false,
  className,
}: Ai42Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1.5 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {typeof tokensPerSecond === "number" && (
          <span className="self-end text-xs tabular-nums text-muted-foreground">
            {tokensPerSecond} tok/s
          </span>
        )}
        <div className="flex flex-wrap gap-0.5">
          {tokens.map((t, i) => (
            <span
              key={i}
              className={cn(
                "rounded-sm px-1 text-xs",
                chipClasses[tone]
              )}
            >
              {t.replace(/ /g, "\u00a0")}
            </span>
          ))}
          <span
            className="inline-block h-3.5 w-0.5 animate-pulse bg-foreground align-middle"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
